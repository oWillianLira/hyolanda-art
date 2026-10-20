import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

const { registerBlockType } = wp.blocks;

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
