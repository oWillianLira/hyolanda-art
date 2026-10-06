import './style.scss';

import Edit from './edit';
import Save from './save';

const { registerBlockType } = wp.blocks;

registerBlockType('hyo/benefits', {
  edit: Edit,
  save: Save,
});
