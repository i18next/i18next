# Introduction

This project is in progress and inspirated by [jsperanto](https://github.com/jpjoyal/jsperanto).

Project goal is to provide a easy way to translate a website on clientside:
- fetch resources from server
- fetch each resource file individual (static) or all once via dynamicRoute
- apply transation to html tags with attribute _data-i18n_
- post missing key-value pairs to server (for easy development -> just add missing key on serverside)
- search for key _en-US_ first, than in _en_, than in fallback language (or de-DE, de , fallback)