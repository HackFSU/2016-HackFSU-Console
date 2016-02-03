/**
 * Handles /judge/* routing
 */
'use strict';

import express from 'express';
import { acl } from 'app/routes/util';
import * as middleware from 'app/routes/user/middleware';
