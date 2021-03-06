// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// flakybot.ts doesn't have the Probot app as a default export.
// Import the app and run it directly rather than using `probot run`.

// eslint-disable-next-line node/no-extraneous-import
import {run} from 'probot';
import {flakybot} from './flakybot';

run(flakybot);
