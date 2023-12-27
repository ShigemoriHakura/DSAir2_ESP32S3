/*********************************************************************
 * Railuino - Hacking your Märklin
 *
 * Copyright (C) 2012 Joerg Pleumann
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * LICENSE file for more details.
 */

#include "TrackReporterS88_DS.h"

// ===================================================================
// === TrackReporterS88_DS ==============================================
// ===================================================================

const int DATA = A0;
const int CLOCK = 6;
const int LOAD = 5;
const int RESET = A3;

const int TIME = 50;
const int TIME_HALF = 25;

TrackReporterS88_DS::TrackReporterS88_DS(int modules) {}
void TrackReporterS88_DS::refresh() {}
void TrackReporterS88_DS::refresh(int inMaxSize) {}
boolean TrackReporterS88_DS::getValue(int index) { return 0; }
byte TrackReporterS88_DS::getByte(int index) { return 0; }
