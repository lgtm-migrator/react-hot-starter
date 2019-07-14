import { Input, Typography, withTheme, WithTheme } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import { Button, IconButton, Tooltip } from 'components';
import { name } from 'faker';
import { merge, range } from 'ramda';
import React, { useState } from 'react';
import {
  AutoSizer,
  InfiniteLoader,
  InfiniteLoaderProps,
  List,
  ListRowRenderer,
  WindowScroller,
} from 'react-virtualized';

export interface Person {
  name: string;
}

export type People = { [index: number]: Person };

const circleWidth = 10;

const createRowRenderer = (list: People): ListRowRenderer => ({
  key,
  index,
  style,
  isScrolling,
  isVisible,
}) => {
  const { name: personsName = '🚧 Not loaded' } = list[index] || {};

  return (
    <div
      key={key}
      style={{
        ...style,
        borderBottom: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Typography style={{ marginRight: 10 }}>
          {index + 1}. {personsName}
        </Typography>
        <div
          style={{
            width: circleWidth,
            height: circleWidth,
            background: isVisible ? 'royalblue' : 'tomato',
            borderRadius: '50%',
          }}
        />
      </div>
      {isScrolling && <Typography variant="caption">Scrolling...</Typography>}
    </div>
  );
};

const initialIndexToScrollTo = -1;

const pageSize = 100;

const rowCount = 2000;

const scrollTopIconBottom = 20;

type LoadMoreRows = InfiniteLoaderProps['loadMoreRows'];

const loadMore = (getName: () => Person['name']) => (
  rangeToLoad: ReturnType<ReturnType<typeof range>>,
) =>
  rangeToLoad.reduce(
    (people, i) => ({
      ...people,
      [i]: { name: getName() },
    }),
    {} as People,
  );

const loadMorePlaceholders = loadMore(() => 'Loading...');

const loadMorePeople = loadMore(() => name.findName());

export interface ImagesProps extends WithTheme {}

const ImageList: React.FC<ImagesProps> = ({ theme }) => {
  const [value, setValue] = useState('');

  const [list, setList] = useState<People>({});

  const [indexToScrollTo, setIndexToScrollTo] = useState(
    initialIndexToScrollTo,
  );

  React.useEffect(() => {
    setList(merge(list, loadMorePeople(range(0)(pageSize))));
  }, []); // eslint-disable-line

  const rowRenderer = createRowRenderer(list);

  const loadMoreRows: LoadMoreRows = ({ startIndex, stopIndex }) => {
    console.log('load rows from', startIndex, 'to', stopIndex);

    const rangeToLoad = range(startIndex)(stopIndex + 1).filter(i => !list[i]);

    const rowsBeingLoaded = loadMorePlaceholders(rangeToLoad);

    setList(merge(list, rowsBeingLoaded));

    return new Promise(resolve => {
      console.log('loaded rows from', startIndex, 'to', stopIndex);

      setList(oldList => merge(oldList, loadMorePeople(rangeToLoad)));

      resolve();
    });
  };

  return (
    <div>
      <Tooltip
        style={{
          position: 'fixed',
          bottom: scrollTopIconBottom,
          right: scrollTopIconBottom,
          zIndex: 2,
          opacity: 0.7,
        }}
        title="Scroll to top"
      >
        <IconButton
          onClick={() => setIndexToScrollTo(0)}
          style={{ background: theme.palette.background.paper }}
        >
          <ArrowUpward />
        </IconButton>
      </Tooltip>
      <form
        onSubmit={e => {
          e.preventDefault();

          setIndexToScrollTo(Number(value) - 1);
        }}
      >
        <Input
          type="number"
          value={value}
          onChange={({ target: { value: newValue } }) => setValue(newValue)}
        />
        <Button type="submit">Submit</Button>
      </form>
      <br />
      <br />
      <InfiniteLoader
        minimumBatchSize={pageSize}
        rowCount={rowCount}
        isRowLoaded={({ index }) => Boolean(list[index])}
        loadMoreRows={loadMoreRows}
      >
        {({ registerChild, onRowsRendered }) => (
          <WindowScroller
            onScroll={() => setIndexToScrollTo(initialIndexToScrollTo)}
          >
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref={registerChild}
                    autoHeight
                    height={height}
                    width={width}
                    onRowsRendered={onRowsRendered}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    onScroll={onChildScroll}
                    rowHeight={40}
                    rowCount={rowCount}
                    rowRenderer={rowRenderer}
                    scrollToIndex={indexToScrollTo}
                    style={{ border: '1px solid #ccc' }}
                    scrollToAlignment="start"
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default withTheme(ImageList);
