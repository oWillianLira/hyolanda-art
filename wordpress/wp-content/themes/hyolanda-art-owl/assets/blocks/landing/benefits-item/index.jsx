import Edit from './edit';
import Save from './save';

const { registerBlockType } = wp.blocks;

registerBlockType('hyo/benefit-item', {
  edit: Edit,
  save: Save,
});
