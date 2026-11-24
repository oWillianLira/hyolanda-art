<?php

function hyo_vite_dev_server_is_running(): bool
{
  static $isRunning = null;

  if ($isRunning !== null) {
    return $isRunning;
  }

  $connection = @fsockopen(
    'host.docker.internal',
    5173,
    $errorCode,
    $errorMessage,
    0.5
  );

  if (!$connection) {
    $isRunning = false;

    return $isRunning;
  }

  fclose($connection);
  $isRunning = true;

  return $isRunning;
}

function hyo_mark_script_as_module(string $handle): void
{
  add_filter('script_loader_tag', function ($tag, $scriptHandle) use ($handle) {
    if ($scriptHandle !== $handle) {
      return $tag;
    }

    return str_replace('<script ', '<script type="module" ', $tag);
  }, 10, 2);
}

function hyo_enqueue_vite_client(): void
{
  if (!hyo_vite_dev_server_is_running()) {
    return;
  }

  wp_enqueue_script(
    'vite-client',
    'http://127.0.0.1:5173/@vite/client',
    [],
    null,
    false
  );

  hyo_mark_script_as_module('vite-client');
}

add_action('enqueue_block_editor_assets', 'hyo_enqueue_vite_client', 0);

function hyo_enqueue_block_variations(): void
{
  $script_path =
    get_template_directory() . '/assets/js/gutenberg/variations.js';

  if (!file_exists($script_path)) {
    return;
  }

  wp_enqueue_script(
    'hyo-block-variations',
    get_template_directory_uri() . '/assets/js/gutenberg/variations.js',
    ['wp-blocks', 'wp-dom-ready', 'wp-i18n'],
    filemtime($script_path),
    true
  );
}

add_action('enqueue_block_editor_assets', 'hyo_enqueue_block_variations', 20);


function hyo_register_blocks()
{
  $theme_path = get_template_directory();
  $theme_uri = get_template_directory_uri();

  $blocks_path = $theme_path . '/assets/blocks';

  if (!is_dir($blocks_path)) {
    return;
  }

  $is_dev = hyo_vite_dev_server_is_running();

  $manifest = [];

  if (!$is_dev) {
    $manifest_path = $theme_path . '/dist/.vite/manifest.json';

    if (!file_exists($manifest_path)) {
      return;
    }

    $manifest = json_decode(
      file_get_contents($manifest_path),
      true
    ) ?? [];
  }

  $iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(
      $blocks_path,
      RecursiveDirectoryIterator::SKIP_DOTS
    )
  );

  foreach ($iterator as $file) {
    if ($file->getFilename() !== 'block.json') {
      continue;
    }

    $block_path = dirname($file->getPathname());

    $relative_path = str_replace(
      '\\',
      '/',
      substr($block_path, strlen($theme_path) + 1)
    );

    $entry_key = $relative_path . '/index.jsx';

    $entry = $is_dev
      ? null
      : ($manifest[$entry_key] ?? null);

    if (!$is_dev && empty($entry['file'])) {
      continue;
    }

    $handle = 'hyo-' . str_replace(
      '/',
      '-',
      str_replace('assets/blocks/', '', $relative_path)
    );

    // Register editor script
    $script_url = $is_dev
      ? 'http://127.0.0.1:5173/' . $entry_key
      : $theme_uri . '/dist/' . $entry['file'];

    wp_register_script(
      $handle,
      $script_url,
      [
        'wp-blocks',
        'wp-element',
        'wp-block-editor',
        'wp-components',
      ],
      null,
      true
    );

    hyo_mark_script_as_module($handle);

    $GLOBALS['hyo_block_editor_scripts'][] = $handle;

    // Register editor styles
    $editor_style_handles = [];

    if ($is_dev) {
      $style_path = $block_path . '/style.scss';

      if (file_exists($style_path)) {
        $style_handle = $handle . '-editor';

        wp_register_style(
          $style_handle,
          'http://127.0.0.1:5173/' .
            $relative_path . '/style.scss',
          [],
          null
        );

        $editor_style_handles[] = $style_handle;
      }
    } elseif (!empty($entry['css'])) {
      foreach ($entry['css'] as $index => $css) {
        $style_handle = $handle . '-' . $index;

        wp_register_style(
          $style_handle,
          $theme_uri . '/dist/' . $css,
          [],
          null
        );

        $editor_style_handles[] = $style_handle;
      }
    }

    // Let WordPress enqueue registered assets
    register_block_type(
      $block_path,
      [
        'editor_script' => $handle,
        'editor_style' => $editor_style_handles,
      ]
    );
  }
}

add_action('init', 'hyo_register_blocks');

add_action('enqueue_block_editor_assets', function () {
  $handles = $GLOBALS['hyo_block_editor_scripts'] ?? [];

  foreach (array_unique($handles) as $handle) {
    wp_enqueue_script($handle);
  }
});
