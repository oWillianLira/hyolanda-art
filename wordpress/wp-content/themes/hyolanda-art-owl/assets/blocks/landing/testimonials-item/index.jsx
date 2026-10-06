import Edit from './edit';
import Save from './save';

const { registerBlockType } = wp.blocks;

registerBlockType('hyo/testimonials-item', {
  edit: Edit,
  save: Save,
});
