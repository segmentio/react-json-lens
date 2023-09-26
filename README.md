# React JSON Lens

The beautiful JSON viewer for React.

![image](https://user-images.githubusercontent.com/11316020/224454284-eb24fc6e-cb1c-478e-b437-1c247a1798a1.png)

## Usage

First install `react-json-lens` using your favourite package manager:

```bash
yarn add react-json-lens
```

> `react` and `styled-components` are peer dependencies that must also be installed

Take it away!

```tsx
import { JSONView } from 'react-json-lens'

export const App = ({ data }) => (
  <Container>
    <JSONView value={data} />
  </Container>
)
```

To use the diffing feature simply pass an `oldValue` prop along with `value`.

## License

The MIT License (MIT)

Copyright (c) 2023 Twilio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
