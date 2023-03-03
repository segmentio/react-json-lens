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
  tags: ['exercitation', 'aliquip', 'exercitation', 'fugiat', 'duis', 'ipsum', 'occaecat'],
  friends: [
    {
      id: 0,
      name: 'Sandy Santana'
    },
    {
      id: 1,
      name: 'Carroll Goodman'
    },
    {
      id: 2,
      name: 'Sandra Walker'
    }
  ],
  greeting: 'Hello, James Rogers! You have 8 unread messages.',
  favoriteFruit: 'strawberry'
}

export const SimpleView = () => <JSONView value={data} />
