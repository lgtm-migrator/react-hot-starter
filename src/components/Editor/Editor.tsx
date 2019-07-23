/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { Divider, makeStyles, useTheme } from '@material-ui/core';
import {
  ContentBlock,
  ContentState,
  DraftBlockType,
  DraftEditorCommand,
  DraftHandleValue,
  DraftInlineStyleType,
  DraftStyleMap,
  Editor as DraftEditor,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import React, { KeyboardEvent } from 'react';
import { BlockTypeControls, InlineStylesControls } from './Controls';

const useStyles = makeStyles({
  editor: {
    '& .public-DraftEditor-content': {
      minHeight: 100,
      minWidth: 360,
    },

    '& .RichEditor-blockquote': {
      borderLeft: '5px solid #eee',
      color: 'grey',
      fontFamily: '"Montserrat", "Georgia", serif',
      fontStyle: 'italic',
      margin: '15px 0',
      padding: '10px 20px',
    },

    '& .public-DraftStyleDefault-pre': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: '1.2em',
      padding: '10px 20px',
    },
  },
});

const tabCharacter = '  ';

const styleMap: DraftStyleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const getBlockStyle = (block: ContentBlock) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return '';
  }
};

export interface EditorProps {
  initialContent?: ContentState;
}

const Editor: React.FC<EditorProps> = ({ initialContent }) => {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(
      initialContent || ContentState.createFromText(''),
    ),
  );

  const editor = React.useRef<DraftEditor>(null);

  const [selection, setSelection] = React.useState<SelectionState>(
    SelectionState.createEmpty(''),
  );

  const focus = () => {
    const { current } = editor;

    if (current) {
      current.focus();
    }
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    newEditorState: EditorState,
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(newEditorState, command);

    if (newState) {
      setEditorState(newState);

      return 'handled';
    } else {
      return 'not-handled';
    }
  };

  const mapKeyToEditorCommand = (e: KeyboardEvent) => getDefaultKeyBinding(e);

  const toggleBlockType = (blockType: DraftBlockType) => {
    const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
    setEditorState(EditorState.acceptSelection(newEditorState, selection));
  };

  const toggleInlineStyle = (inlineStyle: DraftInlineStyleType) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  const contentState = editorState.getCurrentContent();

  const hasText = contentState.isEmpty();

  const isUnstyled =
    contentState
      .getBlockMap()
      .first()
      .getType() === 'unstyled';

  const theme = useTheme();

  const classes = useStyles();

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        padding: 15,
        cursor: 'text',
      }}
    >
      <>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridGap: 20,
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <BlockTypeControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
          <InlineStylesControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
        </div>
        <br />
        <Divider />
        <br />
      </>
      <div className={classes.editor} onClick={focus}>
        <DraftEditor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          spellCheck
          placeholder={!hasText && isUnstyled ? 'Tell a story...' : ''}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onTab={e => {
            e.preventDefault();

            const newContentState = Modifier.replaceText(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              tabCharacter,
            );

            setEditorState(
              EditorState.push(
                editorState,
                newContentState,
                'insert-characters',
              ),
            );
          }}
          onFocus={() => {
            setSelection(selection);
          }}
          onBlur={() => {
            setSelection(editorState.getSelection());
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
