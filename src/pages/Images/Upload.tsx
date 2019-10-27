/* eslint-disable indent */
/* eslint-disable immutable/no-mutation */

import {
  Divider,
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
import { connect, useSelector } from 'react-redux';
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
  ImagesWithId,
  selectDictionary,
  selectImagesBeingVerified,
  selectImagesUploading,
  selectImagesWithIds,
  State,
} from 'store';

export interface ImageProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  boxShadow: CSSProperties['boxShadow'];
  dataUrl: Image['dataUrl'];
  name: Image['name'];
  remove: () => void;
}

export const ImageComponent = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ boxShadow, dataUrl, name, remove, ...imageProps }, ref) => {
    const [hovered, setHovered] = useState(false);

    const toggleHovered = () => setHovered(!hovered);

    return (
      <Box style={{ position: 'relative', display: 'inline-block' }}>
        <img
          ref={ref}
          src={dataUrl}
          alt={name}
          height={150}
          style={{ boxShadow }}
          onMouseEnter={toggleHovered}
          onMouseLeave={toggleHovered}
          {...imageProps}
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
  },
);

export interface UploadProps {
  addImage: CreateAddImage;
  upload: CreateUpload;
  images: ImagesWithId;
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

  const dict = useSelector(selectDictionary);

  const imagesBeingVerified = useSelector(selectImagesBeingVerified);

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
                  dataUrl: String(reader.result),
                  uploadStatus: 'not started',
                  verificationStatus: 'in progress',
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
        {dict.chooseImages}
      </Button>
      <br />
      <br />
      <Typography variant="h4">{dict.chosenImages}</Typography>
      <br />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!images.length || !appropriate}
        isLoading={uploading || imagesBeingVerified}
      >
        {dict.upload}
      </Button>
      <br />
      <br />
      <Divider />
      <List>
        {images.map(
          ({ name, dataUrl, uploadStatus, id, verificationStatus }) => (
            <Box key={name}>
              <ListItem>
                <ListItemText>
                  <Flex alignItems="center">
                    <Tooltip
                      title={
                        appropriate
                          ? ''
                          : 'Image was deemed inappropriate, please choose another one.'
                      }
                    >
                      <Typography
                        variant="h5"
                        style={{
                          marginRight: theme.spacing(1),
                          color: appropriate
                            ? 'initial'
                            : theme.palette.error.dark,
                        }}
                      >
                        {name}
                      </Typography>
                    </Tooltip>
                    {(() => {
                      switch (uploadStatus) {
                        case 'in progress':
                          return <Spinner size={theme.typography.fontSize} />;
                        case 'completed':
                          return (
                            <Tooltip title={dict.uploaded}>
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
                style={{
                  filter:
                    appropriate && verificationStatus !== 'in progress'
                      ? 'none'
                      : 'blur(5px)',
                }}
              />
              <br />
              <br />
              <Divider />
            </Box>
          ),
        )}
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
