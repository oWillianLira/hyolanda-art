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

function hyo_register_blocks()
{
  $is_dev = hyo_vite_dev_server_is_running();
  $manifest_path =
    get_template_directory() . '/dist/.vite/manifest.json';

  $manifest = [];

  if (!$is_dev) {
    if (!file_exists($manifest_path)) {
      return;
    }

    $manifest = json_decode(
      file_get_contents($manifest_path),
      true
    ) ?? [];
  }

  $blocks_path =
    get_template_directory() . '/assets/blocks';

  $block_files = [];

  $iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(
      $blocks_path,
      RecursiveDirectoryIterator::SKIP_DOTS
    )
  );

  foreach ($iterator as $file) {
    if ($file->getFilename() === 'block.json') {
      $block_files[] = $file->getPathname();
    }
  }

  foreach ($block_files as $block_file) {
    $block_path = dirname($block_file);

    $relative_path = str_replace(
      get_template_directory() . '/',
      '',
      $block_path
    );

    $entry_key = $relative_path . '/index.jsx';

    if ($is_dev) {
      $script_url = 'http://127.0.0.1:5173/' . $entry_key;
      $entry = null;
    } else {
      $entry = $manifest[$entry_key] ?? null;

      if (!$entry) {
        continue;
      }

      $script_url = get_template_directory_uri() . '/dist/' . $entry['file'];
    }

    $handle = str_replace(
      '/',
      '-',
      str_replace('assets/blocks/', '', $relative_path)
    );

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
    wp_enqueue_script($handle);

    $editor_style_handles = [];

    if ($is_dev) {
      $editor_style_handle = $handle . '-editor';
      wp_register_style(
        $editor_style_handle,
        'http://127.0.0.1:5173/' . $relative_path . '/style.scss',
        [],
        null
      );
      wp_enqueue_style($editor_style_handle);
      $editor_style_handles[] = $editor_style_handle;
    }

    if (!$is_dev && !empty($entry['css'])) {
      foreach ($entry['css'] as $index => $css) {
        $style_handle = $handle . '-' . $index;
        wp_enqueue_style(
          $style_handle,
          get_template_directory_uri() . '/dist/' . $css,
          [],
          null
        );
        $editor_style_handles[] = $style_handle;
      }
    }

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
