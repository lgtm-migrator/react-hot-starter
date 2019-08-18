/* eslint-disable indent */
/* eslint-disable immutable/no-mutation */

import {
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core';
import { AddToPhotos, CheckCircleOutline, Close } from '@material-ui/icons';
import { Button, IconButton, Spinner } from 'components';
import React, { createRef, CSSProperties, FC, useState } from 'react';
import { connect } from 'react-redux';
import { Box, Flex } from 'rebass';
import {
  createAddImage,
  CreateAddImage,
  CreateRemoveImage,
  createRemoveImage,
  CreateUpload,
  createUpload,
  Image,
  ImagesUploading,
  ImagesWIthId,
  selectImagesUploading,
  selectImagesWithIds,
  State,
} from 'store';

export interface ImageProps {
  boxShadow: CSSProperties['boxShadow'];
  dataUrl: Image['dataUrl'];
  name: Image['name'];
  remove: () => void;
}

export const ImageComponent: FC<ImageProps> = ({
  boxShadow,
  dataUrl,
  name,
  remove,
}) => {
  const [hovered, setHovered] = useState(false);

  const toggleHovered = () => setHovered(!hovered);

  return (
    <Box style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src={dataUrl}
        alt={name}
        height={150}
        style={{ boxShadow }}
        onMouseEnter={toggleHovered}
        onMouseLeave={toggleHovered}
      />
      <IconButton
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: 0.7,
        }}
        onClick={remove}
      >
        <Close />
      </IconButton>
    </Box>
  );
};

export interface UploadProps {
  addImage: CreateAddImage;
  upload: CreateUpload;
  images: ImagesWIthId;
  uploading: ImagesUploading;
  removeImage: CreateRemoveImage;
}

const uploadInputRef = createRef<HTMLInputElement>();

const Upload: FC<UploadProps> = ({
  addImage,
  upload,
  images,
  uploading,
  removeImage,
}) => {
  const theme = useTheme();

  const appropriate = true;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        upload();
      }}
    >
      <input
        ref={uploadInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={({ target: { files } }) => {
          if (files && files.length) {
            Array.from(files).forEach((file, i) => {
              const { name } = file;
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => {
                addImage({
                  name,
                  dataUrl: reader.result as string,
                  uploadStatus: 'not started',
                });
              };
            });
          }
        }}
        hidden
      />
      <Button
        onClick={() => uploadInputRef.current!.click()}
        variant="contained"
      >
        <AddToPhotos style={{ marginRight: theme.spacing(2) }} />
        Choose image files
      </Button>
      <br />
      <br />
      <Typography variant="h4">Chosen Images</Typography>
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={!images.length}
        isLoading={uploading}
      >
        Upload
      </Button>
      <br />
      <List>
        {images.map(({ name, dataUrl, uploadStatus, id }) => (
          <Box key={name}>
            <ListItem>
              <ListItemText>
                <Flex alignItems="center">
                  <Typography
                    variant="h5"
                    style={{
                      marginRight: theme.spacing(1),
                      color: appropriate ? 'initial' : theme.palette.error.dark,
                    }}
                  >
                    {name}
                  </Typography>
                  {(() => {
                    switch (uploadStatus) {
                      case 'in progress':
                        return <Spinner size={theme.typography.fontSize} />;
                      case 'completed':
                        return (
                          <Tooltip title="Successfully Uploaded">
                            <CheckCircleOutline
                              style={{ color: theme.colors.success.dark }}
                            />
                          </Tooltip>
                        );
                      default:
                        return null;
                    }
                  })()}
                </Flex>
              </ListItemText>
            </ListItem>
            <br />
            <ImageComponent
              dataUrl={dataUrl}
              name={name}
              boxShadow={theme.shadows[1]}
              remove={() => removeImage(id)}
            />
          </Box>
        ))}
      </List>
    </form>
  );
};

export default connect(
  (state: State) => ({
    images: selectImagesWithIds(state),
    uploading: selectImagesUploading(state),
  }),
  {
    upload: createUpload,
    addImage: createAddImage,
    removeImage: createRemoveImage,
  },
)(Upload);
