import React from 'react';
import { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppPage } from '../../components/application/AppPage';
import { useFetch } from '../../hooks/use_fetch';
import { fetchJSON } from '../../utils/fetchers';

const TimelineContainer = React.lazy(() => import('../TimelineContainer/TimelineContainer'));
const UserProfileContainer = React.lazy(() => import('../UserProfileContainer/UserProfileContainer'));
const PostContainer = React.lazy(() => import('../PostContainer/PostContainer'));
const TermContainer = React.lazy(() => import('../TermContainer/TermContainer'));
const NotFoundContainer = React.lazy(() => import('../NotFoundContainer/NotFoundContainer'));
const NewPostModalContainer = React.lazy(() => import('../NewPostModalContainer/NewPostModalContainer'));
const AuthModalContainer = React.lazy(() => import('../AuthModalContainer/AuthModalContainer'));

/** @type {React.VFC} */
const AppContainer = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = React.useState(null);
  const { data, isLoading } = useFetch('/api/v1/me', fetchJSON);
  React.useEffect(() => {
    if (data?.message === 'Unauthorized') {
      return;
    }
    setActiveUser(data);
  }, [data]);

  const [modalType, setModalType] = React.useState('none');
  const handleRequestOpenAuthModal = React.useCallback(() => setModalType('auth'), []);
  const handleRequestOpenPostModal = React.useCallback(() => setModalType('post'), []);
  const handleRequestCloseModal = React.useCallback(() => setModalType('none'), []);

  if (isLoading) {
    return (
      <Helmet>
        <title>読込中 - CAwitter</title>
      </Helmet>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AppPage
        activeUser={activeUser}
        onRequestOpenAuthModal={handleRequestOpenAuthModal}
        onRequestOpenPostModal={handleRequestOpenPostModal}
      >
        <Routes>
          <Route element={<UserProfileContainer />} path="/users/:username" />
          <Route element={<PostContainer />} path="/posts/:postId" />
          <Route element={<TermContainer />} path="/terms" />
          <Route element={<TimelineContainer />} path="/" />
          <Route element={<NotFoundContainer />} path="*" />
        </Routes>
      </AppPage>

      {modalType === 'auth' ? (
        <AuthModalContainer onRequestCloseModal={handleRequestCloseModal} onUpdateActiveUser={setActiveUser} />
      ) : null}
      {modalType === 'post' ? <NewPostModalContainer onRequestCloseModal={handleRequestCloseModal} /> : null}
    </Suspense>
  );
};

export { AppContainer };
