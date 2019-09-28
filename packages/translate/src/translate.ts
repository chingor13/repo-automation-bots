/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Application, Context } from 'probot';
import { Translate } from '@google-cloud/translate';

const CONFIGURATION_FILE_PATH = 'translate.yml';
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_THRESHOLD = 0.8;

interface Configuration {
  repoLanguageCode?: string;
  threshold?: number;
}

export = (app: Application) => {
  app.on('issues.opened', async context => {
    const config = (await context.config(
      CONFIGURATION_FILE_PATH,
      {}
    )) as Configuration;
    const repoLanguageCode = config.repoLanguageCode || DEFAULT_LANGUAGE;
    const threshold = config.threshold || DEFAULT_THRESHOLD;

    const translate = new Translate();
    const title = context.payload.issue.title;
    const body = context.payload.issue.body;

    // ignore if no need for translation -or- we are not confident
    // in the source language
    const [detectResult] = await translate.detect(title + "\n" + body);
    if (detectResult.language === repoLanguageCode || detectResult.confidence < threshold) {
      return;
    }

    // make a single request to translate the title and the body
    const [[translatedTitle, translatedBody]] = await translate.translate(
      [title, body],
      repoLanguageCode
    );

    await context.github.issues.update(context.repo({
      issue_number: context.payload.issue.number,
      title: translatedTitle,
      body: `
Translated from ${detectResult.language} (confidence: ${detectResult.confidence}):

<details><summary>Original Title</summary>
${title}</details>

<details><summary>Original Body</summary>
${body}</details>

${translatedBody}
`
    }));
  });
};