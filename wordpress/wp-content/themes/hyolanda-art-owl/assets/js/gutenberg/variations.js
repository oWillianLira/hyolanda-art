const { registerBlockVariation } = wp.blocks;

wp.domReady(() => {
  registerBlockVariation('core/button', {
    name: 'custom-button',
    title: 'Custom Button',
    label: 'Custom Button',
    isDefault: false,
  });
});
