<?php

function hyo_woocommerce_before_main_content()
{
  echo '<div class="hyo-woocommerce hyo-woocommerce-shop">';
}

function hyo_woocommerce_after_main_content()
{
  echo '</div>';
}

add_action(
  'woocommerce_before_main_content',
  'hyo_woocommerce_before_main_content'
);

add_action(
  'woocommerce_after_main_content',
  'hyo_woocommerce_after_main_content'
);

function hyo_woocommerce_product_classes($classes)
{
  $classes[] = 'hyo-product-card';

  return $classes;
}

add_filter(
  'woocommerce_post_class',
  'hyo_woocommerce_product_classes'
);
