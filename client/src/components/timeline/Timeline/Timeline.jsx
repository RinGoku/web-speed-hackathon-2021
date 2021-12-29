import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { TimelineItem } from '../TimelineItem';

/**
 * @typedef {object} Props
 * @property {Array<Models.Post>} timeline
 */

/** @type {React.VFC<Props>} */
const Timeline = ({ timeline }) => {
  return (
    <section>
      {timeline.map((post) => {
        return <TimelineItem key={post.id} post={post} />;
      })}
      {/* <Virtuoso
        style={{ height: '100vh', width: '100%' }}
        totalCount={timeline.length}
        itemContent={(index) => <TimelineItem key={timeline[index].id} post={timeline[index]} />}
      /> */}
    </section>
  );
};

export { Timeline };
