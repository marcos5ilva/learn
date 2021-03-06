import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Query, QueryPathArgs } from '@codement/api';
import { useState, useEffect } from 'react';
import { createContainer } from 'unstated-next';

import myPathsQuery from '../gql/queries/myPaths.gql';
import pathQuery from '../gql/queries/pathWithModules.gql';


const LS_PATH = 'path';
const initialPath = localStorage.getItem(LS_PATH);

export const Path = createContainer(() => {
  const [currentPathId, setCurrentPathId] = useState<string | null>(initialPath);
  const { data: myPaths, loading: loadingMyPaths } = useQuery<{ myPaths: Query['myPaths'] }>(myPathsQuery, {
    fetchPolicy: 'no-cache'
  });

  // Fetch BOTH the path AND it's modules
  const [fetchPathWithModules, { data: pathData, loading: loadingWithModules }] = useLazyQuery<{
    path: Query['path'],
    pathModules: Query['pathModules']
  }, QueryPathArgs>(pathQuery, {
    fetchPolicy: 'no-cache'
  });

  // First run, load paths if no initial path
  useEffect(() => {
    if (!currentPathId && myPaths?.myPaths?.length) {
      setCurrentPathId(myPaths.myPaths[0].pathId);
      // Check if currentPathId is valid
    } else if (currentPathId && myPaths?.myPaths?.length) {
      if (!myPaths.myPaths.some(path => path.pathId === currentPathId)) {
        setCurrentPathId(myPaths.myPaths[0].pathId);
      }
      // If currentPathId is set but no myPaths, remove path from local storage
    } else if (currentPathId && myPaths?.myPaths?.length === 0) {
      setCurrentPathId(null);
    }
  }, [myPaths]);


  // Update local storage LS_PATH when the current path changes
  useEffect(() => {
    if (currentPathId) localStorage.setItem(LS_PATH, currentPathId);
    else localStorage.removeItem(LS_PATH);

    if (currentPathId) {
      fetchPathWithModules({
        variables: { id: currentPathId }
      });
    }
  }, [currentPathId]);

  return {
    currentPathId,
    setCurrentPathId,
    loading: loadingMyPaths || loadingWithModules,
    currentPath: pathData?.path,
    currentModules: pathData?.pathModules,
    myPaths: myPaths?.myPaths
  };
});
