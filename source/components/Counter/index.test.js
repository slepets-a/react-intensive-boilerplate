import dom from 'react-test-renderer';

import Counter from './index';

const renderTree = dom.create(<Counter count = { 3 } />).toJSON();

test('Counter should correspond to its snapshot counterpart', () => {
    expect(renderTree).toMatchSnapshot();
});
