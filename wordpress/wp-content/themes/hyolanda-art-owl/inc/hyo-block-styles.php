<?php
function hyo_button_block_styles()
{
  register_block_style(
    'core/button',
    array(
      'name'  => 'hyo_button',
      'label' => __('Hyo Button', 'hyolanda-art-owl'),
      'is_default' => true,
    )
  );
}

add_action('init', 'hyo_button_block_styles');
