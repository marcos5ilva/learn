import fs from 'fs';
import path from 'path';

const files = [
  'createUser',
  'login',
  'createPath',
  'joinPath',
  'updatePath',
  'updatePreferences',
  'createAssignment',
  'createAssignmentFile',
  'respondToFriendRequest',
  'createFriendship',
  'deleteFriendship',
  'createModule',
  'updateModule',
  'deleteModule',
  'createCharacter',
  'updateCharacter',
  'deleteCharacter',
  'createConcept'
];

export default files.reduce((obj, file) => {
  // eslint-disable-next-line no-param-reassign
  obj[file] = fs.readFileSync(path.join(__dirname, `./${file}.gql`)).toString();
  return obj;
}, {} as { [key: string]: string });
