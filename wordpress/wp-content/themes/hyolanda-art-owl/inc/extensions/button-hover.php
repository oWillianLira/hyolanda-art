<?php

add_filter('render_block', function ($content, $block) {
  if (($block['blockName'] ?? '') !== 'core/button') {
    return $content;
  }

  if (empty($content)) {
    return $content;
  }

  $attributes = $block['attrs'] ?? [];

  $animation = $attributes['hoverAnimation'] ?? 'none';

  $allowedAnimations = [
    'none',
    'scale',
    'fill',
    'slide',
    'lift',
  ];

  if (!in_array($animation, $allowedAnimations, true)) {
    $animation = 'none';
  }

  $duration = (int) ($attributes['hoverDuration'] ?? 300);
  $duration = max(100, min(1000, $duration));

  $classes = [
    'hyo-button-hover',
    'hyo-button-hover--' . $animation,
  ];

  $styles = [
    '--hyo-hover-duration:' . $duration . 'ms',
  ];

  $colors = [
    'hoverBackgroundColor' => [
      'class' => 'has-hyo-hover-bg',
      'variable' => '--hyo-hover-bg',
    ],
    'hoverTextColor' => [
      'class' => 'has-hyo-hover-text',
      'variable' => '--hyo-hover-text',
    ],
    'hoverBorderColor' => [
      'class' => 'has-hyo-hover-border',
      'variable' => '--hyo-hover-border',
    ],
  ];


  foreach ($colors as $attribute => $config) {
    $value = $attributes[$attribute] ?? '';

    if (!is_string($value) || $value === '') {
      continue;
    }

    // Custom HEX color
    $hex = sanitize_hex_color($value);

    if ($hex) {
      $color = $hex;
    } else {
      // Theme preset slug
      if (!preg_match('/^[a-z0-9-]+$/', $value)) {
        continue;
      }

      $color = sprintf(
        'var(--wp--preset--color--%s)',
        $value
      );
    }

    $classes[] = $config['class'];

    $styles[] = sprintf(
      '%s:%s',
      $config['variable'],
      $color
    );
  }


  $processor = new WP_HTML_Tag_Processor($content);

  if (!$processor->next_tag([
    'class_name' => 'wp-block-button',
  ])) {
    return $content;
  }

  foreach ($classes as $class) {
    $processor->add_class($class);
  }

  $existingStyle = $processor->get_attribute('style');
  $existingStyle = is_string($existingStyle)
    ? rtrim(trim($existingStyle), ';')
    : '';

  $newStyle = implode(';', $styles);

  $processor->set_attribute(
    'style',
    $existingStyle !== ''
      ? $existingStyle . ';' . $newStyle
      : $newStyle
  );

  return $processor->get_updated_html();
}, 10, 2);
