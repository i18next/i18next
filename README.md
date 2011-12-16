# Introduction

This project is in progress and inspirated by [jsperanto](https://github.com/jpjoyal/jsperanto).

Project goal is to provide a easy way to translate a website on clientside:

- fetch resources from server
- fetch each resource file individual (static) or all once via dynamicRoute
- apply transation to html tags with attribute _data-i18n_
- post missing key-value pairs to server (for easy development -> just add missing key on serverside)
- search for key _en-US_ first, than in _en_, than in fallback language (or de-DE, de , fallback)

# License

Copyright (c) 2011 Jan Mühlemann

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