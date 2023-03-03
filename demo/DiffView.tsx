import React from 'react'

import { JSONView } from '../src'


const data = {
  _id: '640bb02eafa55c59c1faed30',
  index: 0,
  guid: 'a6554f5e-7c48-4487-b538-b8832a70680b',
  isActive: true,
  balance: '$3,994.77',
  picture: 'http://placehold.it/32x32',
  age: 27,
  eyeColor: 'blue',
  name: 'James Rogers',
  gender: 'male',
  company: 'TALAE',
  email: 'jamesrogers@talae.com',
  phone: '+1 (801) 587-2183',
  address: '161 Clinton Avenue, Hiwasse, Oklahoma, 2081',
  registered: '2020-05-13T08:27:46 +07:00',
  latitude: -15.825059,
  longitude: 4.692765,
  tags: ['running', 'basketball', 'kayaking'],
  friends: [
    {
      id: 998305,
      name: 'Sandy Santana'
    },
    {
      id: 897422,
      name: 'Carroll Goodman'
    },
    {
      id: 282975,
      name: 'Sandra Walker'
    }
  ],
  greeting: 'Hello, James Rogers! You have 8 unread messages.',
  favoriteFruit: 'strawberry'
}

const newData: typeof data = {
  ...data,
  isActive: false,
  favoriteFruit: 'mango',
  friends: [
    {
      id: 998305,
      name: 'Sandy Santana'
    },
    {
      id: 492852,
      name: 'Markus Smith'
    },
    {
      id: 897422,
      name: 'Carroll Goodman'
    },
    {
      id: 198593,
      name: 'Jacob Pinkman'
    }
  ],
  tags: ['hiking', 'snowboarding']
}

export const DiffView = () => <JSONView value={newData} oldValue={data} />
