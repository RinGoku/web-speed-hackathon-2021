import React from 'react';
import { Helmet } from 'react-helmet';
import { useFetch } from '../../hooks/use_fetch';
import { InfiniteScroll } from '../../components/foundation/InfiniteScroll';
import { TimelinePage } from '../../components/timeline/TimelinePage';
import { useInfiniteFetch } from '../../hooks/use_infinite_fetch';
import { fetchJSON } from '../../utils/fetchers';

/** @type {React.VFC} */
const TimelineContainer = () => {
  const { data: post, isLoading: isLoadingPost } = useFetch('/api/v1/posts', fetchJSON);
  const { data: posts, fetchMore } = useInfiniteFetch('/api/v1/posts', post);
  console.log(posts);
  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>
      <Helmet>
        <title>タイムライン - CAwitter</title>
      </Helmet>
      <TimelinePage timeline={posts} />
    </InfiniteScroll>
  );
};

export { TimelineContainer };
export default TimelineContainer;
