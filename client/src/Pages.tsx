import React, { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useSnapshot } from 'valtio';
import Create from './pages/create-poll';
import Join from './pages/join-poll';
import { WaitingRoom } from './pages/wating-room';
import Welcome from './pages/welcome';
import { actions, AppPage, state } from './state';

const routeConfig = {
  [AppPage.Welcome]: Welcome,
  [AppPage.Create]: Create,
  [AppPage.Join]: Join,
  [AppPage.WaitingRoom]: WaitingRoom,
};

const Pages: React.FC = () => {
  const currentState = useSnapshot(state);

  const nodeRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});


  Object.keys(routeConfig).forEach((page) => {
    if (!nodeRefs.current[page]) {
      nodeRefs.current[page] = React.createRef();
    }
  });

  useEffect(() => {
    if (
      currentState.me?.id &&
      currentState.poll &&
      !currentState.poll?.hasStarted
    ) {
      actions.setPage(AppPage.WaitingRoom);
    }
  }, [currentState.me?.id, currentState.poll?.hasStarted]);

  return (
    <>
      {Object.entries(routeConfig).map(([page, Component]) => (
        <CSSTransition
          key={page}
          in={page === currentState.currentPage}
          timeout={300}
          classNames="page"
          nodeRef={nodeRefs.current[page]}
          unmountOnExit
        >
          <div
            ref={nodeRefs.current[page]}
            className="page mobile-height max-w-screen-sm mx-auto py-8 px-4 overflow-y-auto"
          >
            <Component />
          </div>
        </CSSTransition>
      ))}
    </>
  );
};

export default Pages;
