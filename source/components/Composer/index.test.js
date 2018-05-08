import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Composer } from './index';

configure({ adapter: new Adapter() });

const initialState = {
    comment: '',
};

const props = {
    avatar: 'some-url',
    createPost: jest.fn(),
    currentUserFirstName: 'John',
};

const message = 'Hello Lectrum';
const mutatedState = {
    comment: message,
};

const result = mount(<Composer { ...props } />);

// mock and test fetch
global.fetch = jest.fn(() => Promise.resolve({
    status: 200,
    json:   jest.fn(() => Promise.resolve({ data: ['some fake data']})),
}));

fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => { console.log(response.json()); });

// TODO: Important!!!
console.log(result.debug());

describe('Composer', () => {
    test('Should have 1 \'section\' element', () => {
        expect(result.find('section')).toHaveLength(1);
    });

    test('Should have 1 \'img\' element', () => {
        expect(result.find('img')).toHaveLength(1);
    });

    test('Should have a valid initial state', () => {
        expect(result.state()).toEqual(initialState);
    });

    test('textarea value should be empty initially', () => {
        expect(result.find('textarea').text()).toBe('');
    });

    test('Should correctly change the state', () => {
        result.setState(() => ({
            comment: message,
        }));
        expect(result.state()).toEqual(mutatedState);
        expect(result.find('textarea').text()).toBe(mutatedState.comment);

        result.setState(() => ({
            comment: '',
        }));
        expect(result.state()).toEqual(initialState);
        expect(result.find('textarea').text()).toBe(initialState.comment);
    });

    test('Component state and textarea value shoul reflect according changes', () => {
        result.find('textarea').simulate('change', {
            target: {
                value: message,
            },
        });
        expect(result.state()).toEqual(mutatedState);
        expect(result.find('textarea').text()).toBe(message);
    });

    test('Component should call method after button click', () => {
        result.find('input').simulate('click');
        expect(result.props().createPost).toHaveBeenCalled();
        // expect(props.createPost.mock.calls).toHaveLength(1);
    });

    // test async functions
    // test('Component state and textarea value shoul reflect according changes', async () => {
    //         await ttt()
    //         exp
    // });

    // TODO: Practice with Sinon.js

    // const spy = jest.spyOn(Composer.prototype, 'componentDidUpdate');
    // console.log(spy.mock);
    // spy.mockClear();
    // spy.mockReset();
});
