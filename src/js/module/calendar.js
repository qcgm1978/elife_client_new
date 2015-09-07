elife.directive('calendar', function () {
    return {
        link: function (scope, element, attrs) {
            var mNow = 0,       // 当前相对月份
                yNow = 0,       // 当前相对年份
                silde = false;  // 日历列表正在滑动
            var oCalenWrap = create('div', {"class": 'calen-wrap'}),     // 最大父级
                oCalenMask = create('div', {"class": 'calen-mask'}),           // 灰快遮罩
                oCalen = create('div', {"class": 'calen'}),              // 日历box
                calendarList = create('div', {"class": 'calen-list'}),         // 日历列表
                past,           // 过去的时间是否可选
                calenTitles,    // 年，月标题
                aMonths,        // 可以选择的所有月份
                aYears,         // 可以选择的所有年份
                yearTitle,      // 当前年标题
                monthTitle,     // 当前月标题
                prevYearBtn,    // 上一年
                nextYearBtn,    // 下一年
                prevMonthBtn,   // 上个月
                nextMonthBtn,   // 下个月
                selectYearBox,  // 年份选择
                selectMonthBox, // 月份选择
                nowCalendar;    // 当前日历
            function Calendar() {
                var oDate = new Date();
                this.focusObj = null;
                this.shield = '[]';
                this.fixDate = {y: oDate.getFullYear(), m: oDate.getMonth() + 1, d: oDate.getDate()};
                this.startDate = '';
                this.startJSON = {};
                this.hours = false;
                this.hoursPast = false;
                // 开始初始化
                this.init();
            }

            // 初始化
            Calendar.prototype.init = function () {
                var _this = this;
                var aCalendars = getObj(document, '.calendars');
                if (!aCalendars.length)return;
                document.body.appendChild(oCalenWrap);
                oCalenWrap.appendChild(oCalenMask);
                oCalenWrap.appendChild(oCalen);
                calenTitle = getObj(oCalen, '.calen-title');
                // 创建头部
                this.createHeader(function () {

                    // 创建星期标题头
                    _this.createWeek();
                    oCalen.appendChild(calendarList);
                    // 滑动切换上下月
                    sildeSwitch(calendarList, function (obj, dir) {
                        dir > 0 ? mNow-- : mNow++;
                        _this.startJSON.prev.m = mNow - 1;
                        _this.startJSON.now.m = mNow;
                        _this.startJSON.next.m = mNow + 1;
                        _this.transitions(obj, dir);
                    })
                    // 显示/隐藏 月/年 份选择
                    for (var i = 0; i < calenTitles.length; i++) {
                        calenTitles[i].onclick = function () {
                            if (toolClass(this, 'calen-month-txt', 'has')) {

                                // 显示或者隐藏
                                toolClass(selectMonthBox, 'active', (selectMonthBox.show ? 'remove' : 'add'));
                                // 同时隐藏年月份
                                if (selectYearBox.show) {
                                    toolClass(selectYearBox, 'active', 'remove');
                                    selectYearBox.show = false;
                                }
                                // 设置当前月份高亮
                                for (var x = 0; x < aMonths.length; x++) {
                                    if (aMonths[x].getAttribute('data-value') == this.getAttribute('data-value')) {
                                        toolClass(aMonths[x], 'active');
                                    } else {
                                        toolClass(aMonths[x], 'active', 'remove');
                                    }
                                }
                                selectMonthBox.show = !selectMonthBox.show;
                            }
                            else if (toolClass(this, 'calen-year-txt', 'has')) {
                                toolClass(selectYearBox, 'active', (selectYearBox.show ? 'remove' : 'add'));
                                if (selectMonthBox.show) {
                                    toolClass(selectMonthBox, 'active', 'remove');
                                    selectMonthBox.show = false;
                                }
                                // 设置当前年份高亮
                                for (var x = 0; x < aYears.length; x++) {
                                    if (aYears[x].getAttribute('data-value') == this.getAttribute('data-value')) {
                                        toolClass(aYears[x], 'active');
                                    }
                                    else {
                                        toolClass(aYears[x], 'active', 'remove');
                                    }
                                }
                                selectYearBox.show = !selectYearBox.show;
                            }
                        }
                    }
                });
                // 月
                this.createDate({}, function (months) {
                    for (var i = 0; i < aMonths.length; i++) {
                        months[i].onclick = function () {
                            for (var x = 0; x < months.length; x++) {
                                toolClass(months[x], 'active', 'remove');
                            }
                            mNow += this.getAttribute('data-value') - monthTitle.getAttribute('data-value');
                            _this.appendList({}, function () {
                                _this.addEvent();
                            });
                            toolClass(this, 'active');
                            toolClass(selectMonthBox, 'active', 'remove');
                            selectYearBox.show = false;
                            selectMonthBox.show = false;
                        }
                    }
                });
                // 显示日历
                for (var i = 0; i < aCalendars.length; i++) {
                    aCalendars[i].onclick = function () {
                        nowCalendar = this.getAttribute("Calendar");
                        var start = Number(this.getAttribute('start')) || 1915,
                            end = Number(this.getAttribute('end')) || 2020;
                        past = !(this.getAttribute('past') == null);
                        _this.hours = !(this.getAttribute('hours') == null);
                        _this.hoursPast = !(this.getAttribute('hours-past') == null);
                        _this.shield = getDate(this.getAttribute('shield') || '');
                        _this.startDate = getDate(this.getAttribute('start-date') || '');
                        var prev, now, next, oDate = new Date();
                        if (_this.startDate instanceof Array && _this.startDate.length) {
                            var startDate = _this.startDate[0];
                            yNow = startDate.y - oDate.getFullYear();
                            mNow = startDate.m - (oDate.getMonth() + 1);
                            _this.fixDate.y = startDate.y;
                            _this.fixDate.m = startDate.m;
                            _this.fixDate.d = startDate.d;
                            prev = {y: yNow, m: mNow - 1},
                                now = {y: yNow, m: mNow, d: startDate.d},
                                next = {y: yNow, m: mNow + 1};
                            _this.startJSON = {"prev": prev, "now": now, "next": next};
                        }
                        else {
                            _this.fixDate.y = oDate.getFullYear();
                            _this.fixDate.m = oDate.getMonth();
                            _this.fixDate.d = oDate.getDate()
                        }
                        if (_this.focusObj != this) {
                            if (!_this.startDate instanceof Array || !_this.startDate) {
                                mNow = 0;
                                yNow = 0;
                                _this.startJSON.prev = {y: yNow, m: mNow - 1};
                                _this.startJSON.now = {y: yNow, m: mNow};
                                _this.startJSON.next = {y: yNow, m: mNow + 1};
                            }
                            // 创建日历对象列表
                            _this.appendList(_this.startJSON, function () {
                                _this.addEvent();
                            });
                            // 年
                            _this.createDate({"start": start, "end": end, "type": 'year'}, function (years) {
                                for (var k = 0; k < years.length; k++) {
                                    years[k].onclick = function () {
                                        for (var x = 0; x < years.length; x++) {
                                            toolClass(years[x], 'active', 'remove');
                                        }
                                        yNow += this.getAttribute('data-value') - yearTitle.getAttribute('data-value');
                                        _this.appendList({}, function () {
                                            _this.addEvent();
                                        });
                                        toolClass(this, 'active');
                                        toolClass(selectYearBox, 'active', 'remove');
                                        selectYearBox.show = false;
                                        selectMonthBox.show = false;
                                    }
                                }
                                sildeSwitch(selectYearBox, function (obj, dir) {
                                    selectYearBox.index = selectYearBox.index || 0;
                                    var count = selectYearBox.children.length;
                                    if (dir > 0) {
                                        selectYearBox.index++;
                                        if (selectYearBox.index >= 0)selectYearBox.index = 0;
                                    } else {
                                        selectYearBox.index--;
                                        if (selectYearBox.index <= -count)selectYearBox.index = -(count - 1);
                                    }
                                    var val = 'translateX(' + (selectYearBox.index * (100 / count)) + '%)';
                                    selectYearBox.style.WebkitTransform = val;
                                    selectYearBox.style.transform = val;
                                    setTimeout(function () {
                                        silde = false;
                                    }, 500);
                                })
                            });
                        }
                        toolClass(oCalenWrap, 'active');
                        _this.focusObj = this;
                        this.blur();
                        return false;
                    }
                }
                oCalen.onclick = function (ev) {
                    var oEv = ev.targetTouches ? ev.targetTouches[0] : (ev || event);
                    oEv.cancelBubble = true;
                }
                oCalenMask.onclick = hideCalen;
            }
            /**
             * 创建日历列表
             * @return {[type]}        [description]
             */
            Calendar.prototype.createCalenList = function (data, setTitle) {
                var oList = document.createElement('div'),
                    created = 0,
                    _this = this;
                data = data || {};
                data.m = data.m || 0;
                data.y = data.y || 0;
                var date = new Date();
                //
                var date = new Date(),
                    tDay = date.getDate();
                date.setFullYear(date.getFullYear() + data.y, (date.getMonth() + data.m + 1), 1, 0, 0, 0);
                date.setDate(0);
                var dSun = date.getDate();
                date.setDate(1);
                var dWeek = date.getDay();
                var date = new Date();
                date.setFullYear(date.getFullYear() + data.y, date.getMonth() + data.m, 1, 0, 0, 0);
                // 获取当前年月
                var tMonth = date.getMonth() + 1, tYear = date.getFullYear();
                // 设置上一个月的最后一天
                date.setDate(0);
                var lastDay = date.getDate(), lastMonths = [];
                for (var i = lastDay; i > 0; i--)lastMonths.push(i);
                // 设置标题
                if (setTitle) {
                    yearTitle.innerHTML = tYear;
                    monthTitle.innerHTML = (tMonth < 10 ? '0' + tMonth : tMonth);
                    yearTitle.setAttribute('data-value', tYear);
                    monthTitle.setAttribute('data-value', tMonth - 1);
                }
                // 创建上月尾部分
                var lastMonthDay = dWeek + 7;
                lastMonthDay = lastMonthDay >= 10 ? lastMonthDay - 7 : lastMonthDay;
                for (var i = 0; i < lastMonthDay; i++) {
                    var oSpan = create('span'),
                        oNum = create('a', {
                            "data-calen": (tYear + '/' + (tMonth - 1) + '/' + lastMonths[i]),
                            "class": 'prev-m prev-to-month pasted',
                            "href": 'javascript:;'
                        }, lastMonths[i]);
                    if (lastMonths[i] == tDay && data.m == 1 && !data.y)toolClass(oNum, 'today');
                    oSpan.appendChild(oNum);
                    if (oList.children.length) {
                        oList.insertBefore(oSpan, oList.children[0]);
                    } else {
                        oList.appendChild(oSpan);
                    }
                    created++;
                }
                // 这当前月的日期列表
                for (var i = 0; i < dSun; i++) {
                    created++;
                    var n = i + 1,
                        oSpan = create('span'),
                        oNum = create('a', {
                            "data-calen": (tYear + '/' + tMonth + '/' + n),
                            "href": 'javascript:;'
                        }, n);
                    if (created % 7 == 1 || created % 7 == 0) {
                        oNum.className = 'weekend';
                    }
                    if (!data.m && !data.y) {
                        if (n == tDay) {
                            oNum.className = oNum.className + ' today';
                        } else if (n < tDay) {
                            oNum.className = oNum.className + ' expire';
                        }
                    }
                    else if ((past && data.m < 0 && data.y <= 0)) {
                        oNum.className = ' expire';
                    }
                    // 设置是否小于用户定义的开始日期
                    // if(tYear <= _this.fixDate.y && tMonth <= _this.fixDate.m && n < data.d || tYear <= _this.fixDate.y && tMonth < _this.fixDate.m){
                    //     toolClass(oNum, 'expire');
                    //     toolClass(oNum, 'pasted');
                    // }
                    // 设置禁用日期
                    // if(setShiled(tYear, tMonth, n)){
                    //     toolClass(oNum, 'expire');
                    //     toolClass(oNum, 'pasted');
                    //     toolClass(oNum, 'shield');
                    // }
                    oSpan.appendChild(oNum);
                    oList.appendChild(oSpan);
                }
                // 创建下月尾部分
                var nextMonths = 42 - oList.children.length;
                for (var i = 0; i < nextMonths; i++) {
                    var n = i + 1,
                        oSpan = create('span'),
                        oNum = create('a', {
                            "data-calen": (tYear + '/' + (tMonth + 1) + '/' + n),
                            "class": 'next-m next-to-month',
                            "href": 'javascript:;'
                        }, n);
                    if (n == tDay && data.m == -1 && !data.y)toolClass(oNum, 'today');
                    oSpan.appendChild(oNum);
                    oList.appendChild(oSpan);
                }
                // 设置禁用日期
                function setShiled(iyear, imonth, idate) {
                    if (!_this.shield)return false;
                    for (var k = 0; k < _this.shield.length; k++) {
                        _this.shield[k].y = _this.shield[k].y || data.getFullYear();
                        _this.shield[k].m = _this.shield[k].m || data.getMonth() + 1;
                        _this.shield[k].d = _this.shield[k].d || data.getDate();
                        if (iyear == _this.shield[k].y && imonth == _this.shield[k].m && idate == _this.shield[k].d)return true;
                    }
                    return false;
                }

                return oList;
            }
            /**
             * 创建年月
             * @param  {[type]} data.start  [开始日期]
             * @param  {[type]} data.end    [结束日期]
             * @param  {[type]} data.type   ["year"/"month"(默认)]
             * @param  {[type]} cb          [description]
             * @return {[type]}             [description]
             */
            Calendar.prototype.createDate = function (data, cb) {
                data = data || {};
                data.start = data.start || 1;
                data.end = data.end || 12;
                data.type = data.type || 'month';
                var oDateList = create('div', {
                    "class": (data.type == 'month' ? 'calen-months' : 'calen-years')
                });
                var oList = create('div'),
                    arr = [],
                    count = 0,
                    len = 0,
                    now = 0,
                    nowY = (new Date()).getFullYear();
                for (var i = data.start; i <= data.end; i++) {
                    var oSpan = create('span'),
                        oNum = create('a', {
                            "data-value": (data.type == 'year' ? i : i - 1),
                            "href": 'javascript:;'
                        }, (i < 10 ? '0' + i : i));
                    arr.push(oNum);
                    if (data.type == 'year') {
                        if (count >= 12) {
                            oDateList.appendChild(oList);
                            oList = create('div');
                            count = 0;
                            len++;
                        }
                        if (i == nowY)now = len;
                        oSpan.appendChild(oNum);
                        oList.appendChild(oSpan);
                    }
                    else {
                        oSpan.appendChild(oNum);
                        oDateList.appendChild(oSpan);
                    }
                    count++;
                }
                ;
                if (data.type == 'year') {
                    if (selectYearBox && oCalen)oCalen.removeChild(selectYearBox);
                    oDateList.appendChild(oList);
                    selectYearBox = oDateList;
                    aYears = arr;
                    if (count)len++;
                    oDateList.style.width = (len * 100) + '%';
                    for (var i = 0; i < len; i++) {
                        oDateList.children[i].style.width = 100 / len + '%';
                    }
                    // 设置当前显示的页
                    oDateList.style.WebkitTransform = 'translateX(-' + (now * (100 / len)) + '%)';
                    oDateList.style.transform = 'translateX(-' + (now * (100 / len)) + '%)';
                    selectYearBox.index = -now;
                }
                else {
                    if (selectMonthBox && oCalen)oCalen.removeChild(selectMonthBox);
                    selectMonthBox = oDateList;
                    aMonths = arr;
                }
                oCalen.appendChild(oDateList);
                cb && cb(arr);
            }
            /**
             * 创建时间
             * @return {[type]} [description]
             */
            Calendar.prototype.createTime = function (obj, date, today, past) {
                var oTime = getObj(oCalen, '.calen-time'),
                    child = [],
                    oDate = new Date(),
                    day = oDate.getDate(),
                    hours = oDate.getHours(),
                    _this = this;
                if (!oTime.length) {
                    oTime = create('div', {"class": 'calen-time'});
                    for (var i = 0; i < 24; i++) {
                        var time = i < 10 ? '0' + i : i;
                        time += ':00';
                        var oSpan = create('span'),
                            oNum = create('a', {"href": 'javascript:;', "data-time": time}, time);
                        if (past && mNow < 0 && yNow <= 0) {
                        }
                        oSpan.appendChild(oNum);
                        oTime.appendChild(oSpan);
                        child.push({"obj": oNum, "time": parseInt(time, 10)});
                    }
                }
                else {
                    oTime = oTime[0];
                    var arr = getObj(oTime, 'a');
                    for (var i = 0; i < arr.length; i++) {
                        child.push({"obj": arr[i], "time": parseInt(arr[i].getAttribute('data-time'), 10)});
                    }
                }
                toolClass(oTime, 'active');
                for (var i = 0; i < child.length; i++) {
                    if (_this.hoursPast && ((mNow < 0 && yNow <= 0) || (today == day && child[i].time <= hours) || (mNow <= 0 && yNow <= 0 && today < day))) {
                        toolClass(child[i].obj, 'expire')
                        toolClass(child[i].obj, 'pasted');
                        child[i].obj.active = false;
                    }
                    else {
                        toolClass(child[i].obj, 'expire', 'remove');
                        toolClass(child[i].obj, 'pasted', 'remove');
                        child[i].obj.active = true;
                    }
                    (function (time) {
                        child[i].obj.onclick = function () {

                            // 设置日期时间
                            if (this.active) {
                                var val = date + ' ' + (time < 10 ? '0' + time : time) + ':00';
                                if (obj.value != null) {
                                    obj.value = val;
                                } else if (obj.innerHTML != null) {
                                    obj.innerHTML = val;
                                }
                                hideCalen();
                            }
                            toolClass(oTime, 'active', 'remove');
                        }
                    })(child[i].time);
                }
                oCalen.appendChild(oTime);
            }
            /**
             * 创建头部
             * @return {[type]}      [description]
             */
            Calendar.prototype.createHeader = function (cb) {
                calenTitles = calenTitles || [];
                var _this = this;
                var header = create('div', {"class": 'calen-header'});
                var year = create('div', {"class": 'calen-year'}),
                    prevYear = create('a', {
                        "class": 'float-l year-prev switch-btn', "href": 'javascript:;'
                    }, '&lt;'),
                    nextYear = create('a', {
                        "class": 'float-r year-next switch-btn', "href": 'javascript:;'
                    }, '&gt;'),
                    calenYearTxt = create('a', {"class": 'calen-year-txt calen-title', "href": 'javascript:;'});
                year.appendChild(prevYear);
                year.appendChild(calenYearTxt);
                year.appendChild(nextYear);
                var month = create('div', {"class": 'calen-month'}),
                    prevMonth = create('a', {
                        "class": 'float-l month-prev switch-btn', "href": 'javascript:;'
                    }, '&lt;'),
                    nextMonth = create('a', {
                        "class": 'float-r month-next switch-btn', "href": 'javascript:;'
                    }, '&gt;'),
                    calenMonthTxt = create('a', {"class": 'calen-month-txt calen-title', "href": 'javascript:;'});
                month.appendChild(prevMonth);
                month.appendChild(calenMonthTxt);
                month.appendChild(nextMonth);
                header.appendChild(year);
                header.appendChild(month);
                calenTitles.push(calenYearTxt, calenMonthTxt);
                monthTitle = calenMonthTxt;
                yearTitle = calenYearTxt;
                // 按钮切换上下月/年
                prevMonth.onclick = function () {
                    _this.switchDate(-1);
                }
                nextMonth.onclick = function () {
                    _this.switchDate(1);
                }
                prevYear.onclick = function () {
                    _this.switchDate(-1, 'year');
                }
                nextYear.onclick = function () {
                    _this.switchDate(1, 'year');
                }
                if (oCalen.children.length) {
                    oCalen.insertBefore(header, oCalen.children[0]);
                } else {
                    oCalen.appendChild(header);
                }
                for (var i = 0; i < header.children.length; i++) {
                    header.children[i].ontouchstart = function () {
                        toolClass(this, 'active');
                    }
                    header.children[i].ontouchend = function () {
                        toolClass(this, 'active', 'remove');
                    }
                }
                cb && cb();
            }
            /**
             * 创建头部
             * @return {[type]}      [description]
             */
            Calendar.prototype.createWeek = function () {
                var week = create('div', {"class": 'calen-week'}),
                    weeks = '日一二三四五六';
                for (var i = 0; i < 7; i++) {
                    var n = i + 1, data = {};
                    // 周末加上标识
                    if (n % 7 == 1 || n % 7 == 0) {
                        data["class"] = 'weekend';
                    }
                    week.appendChild(create('span', data, weeks.charAt(i)));
                }
                oCalen.appendChild(week);
            }
            /**
             *
             * 插入日历对象
             * @param  {Function} cb [description]
             * @return {[type]}      [description]''
             */
            Calendar.prototype.appendList = function (data, cb) {
                data = data || {};
                data.prev = data.prev || {m: mNow - 1, y: yNow};
                data.now = data.now || {m: mNow, y: yNow};
                data.next = data.next || {m: mNow + 1, y: yNow};
                calendarList.innerHTML = '';
                calendarList.appendChild(this.createCalenList(data.prev));
                calendarList.appendChild(this.createCalenList(data.now, true));
                calendarList.appendChild(this.createCalenList(data.next));
                cb && cb();
            }
            /**
             * 设置日历事件
             */
            Calendar.prototype.addEvent = function () {
                var _this = this;
                var aCalenSet = calendarList.getElementsByTagName('a');
                for (var i = 0; i < aCalenSet.length; i++) {
                    aCalenSet[i].onclick = function () {
                        if (toolClass(this, 'prev-to-month', 'has')) {
                            _this.switchDate(-1);
                        }
                        else if (toolClass(this, 'next-to-month', 'has')) {
                            _this.switchDate(1);
                        }
                        else if (!toolClass(this, 'pasted', 'has') && !past) {
                            var date = this.getAttribute('data-calen'), today = this.innerHTML;
                            date = format(date, (_this.focusObj.getAttribute('format') || false));
                            if (_this.hours) {
                                _this.createTime(_this.focusObj, date, today, past);
                            }
                            else {
                                if (_this.focusObj.value != null)_this.focusObj.value = date;
                                if (_this.focusObj.innerHTML != null)_this.focusObj.innerHTML = date;
                                hideCalen();
                            }
                        }
                        // scope.order_date = date;
                        scope.checkDate(date, nowCalendar);
                    }
                }
            }
            /**
             * 切换上下月
             * @param  {[type]} dir  [description]
             * @param  {[type]} type [description]
             * @return {[type]}      [description]
             */
            Calendar.prototype.switchDate = function (dir, type) {
                var _this = this;
                type = type || 'month';
                switch (type) {
                    case 'month':
                        dir > 0 ? mNow++ : mNow--;
                        _this.startJSON.prev.m = mNow - 1;
                        _this.startJSON.now.m = mNow;
                        _this.startJSON.next.m = mNow + 1;
                        _this.transitions(calendarList, dir > 0 ? -1 : 1);
                        break;
                    case 'year':
                        _this.appendList({
                            prev: {
                                m: mNow,
                                y: yNow - 1
                            },
                            next: {
                                m: mNow,
                                y: yNow + 1
                            }
                        }, function () {
                            dir > 0 ? yNow++ : yNow--;
                            _this.startJSON.now.y = yNow;
                            _this.transitions(calendarList, dir > 0 ? -1 : 1);
                        });
                        break;
                }
            }
            /**
             * 切换月份动画
             * @param  {[type]} obj [description]
             * @param  {[type]} dir [上个月还是下个月]
             */
            Calendar.prototype.transitions = function (obj, dir) {
                var _this = this;
                if (dir > 0) {
                    toolClass(obj, 'silde');
                    toolClass(obj, 'prev-to');
                }
                else {
                    toolClass(obj, 'silde');
                    toolClass(obj, 'next-to');
                }
                setTimeout(function () {
                    end();
                }, 500)
                function end() {
                    _this.appendList(_this.startJSON, function () {
                        toolClass(obj, 'silde', 'remove');
                        toolClass(obj, 'prev-to', 'remove');
                        toolClass(obj, 'next-to', 'remove');
                        _this.addEvent();
                        silde = false;
                    })
                }
            }
            /**
             * 滑动切换日期
             * @param  {[type]} ev [description]
             * @return {[type]}    [description]
             */
            function sildeSwitch(obj, callBack) {
                obj.ontouchstart = start;
                obj.onmousedown = start;
                function start(ev) {
                    var oEv = ev.targetTouches ? ev.targetTouches[0] : (ev || event);
                    var disX = oEv.pageX;
                    var needW = parseInt(document.documentElement.clientWidth / 5, 10);
                    var dir;
                    var _this = this;

                    function move(ev) {
                        var oEv = ev.targetTouches ? ev.targetTouches[0] : (ev || event);
                        dir = oEv.pageX - disX;
                        if (silde)return false;
                        if (Math.abs(dir) >= needW) {
                            silde = true;
                            callBack && callBack(_this, dir);
                        }
                        oEv.preventDefault && oEv.preventDefault();
                        return false;
                    }

                    function end(ev) {
                        this.ontouchmove && (this.ontouchmove = null);
                        this.ontouchend && (this.ontouchend = null);
                        this.onmousemove && (this.onmousemove = null);
                        this.onmouseup && (this.onmouseup = null);
                    }

                    // 移动
                    this.ontouchmove = move;
                    this.onmousemove = move;
                    // 结束
                    this.ontouchend = end;
                    this.onmouseup = end;
                }
            }

            /**
             * 查找/添加/删除 className
             * @param  {[type]} obj    [description]
             * @param  {[type]} sClass [需要处理的class]
             * @param  {[type]} type   ['add:添加'(默认), 'remove:删除', 'has:查找']
             */
            function toolClass(obj, sClass, type) {
                if (!sClass)return;
                var nowClass = obj.className.replace(/\s+/g, ' ');
                nowClass = nowClass.split(' ');
                sClass = sClass.replace(/\s+/, '');
                type = type || 'add';
                for (var i = 0; i < nowClass.length; i++) {
                    switch (type) {
                        case 'has':
                            if (sClass == nowClass[i])return true;
                            break;
                        case 'add':
                        case 'remove':
                            if (sClass == nowClass[i])nowClass.splice(i, 1);
                            break;
                    }
                }
                if (type == 'add')nowClass.push(sClass);
                obj.className = nowClass.join(' ');
            }

            /**
             * 获取元素
             * @param  {[type]} parent [description]
             * @param  {[type]} str    [type]
             */
            function getObj(parent, str) {
                var type = str.charAt(0), result;
                switch (type) {
                    case '#':
                        result = parent.getElementById(str.substring(1));
                        break;
                    case '.':
                        result = parent.getElementsByClassName(str.substring(1));
                        break;
                    default:
                        result = parent.getElementsByTagName(str);
                        break;
                }
                return result;
            }

            /**
             * 创建元素
             * @param  {[type]} tagname [标签名字]
             * @param  {[type]} attr    [属性(多个)]
             * @param  {[type]} html    [内容]
             */
            function create(tagname, attr, html) {
                if (!tagname)return;
                attr = attr || {};
                html = html || '';
                var tag = document.createElement(tagname);
                for (var i in attr) {
                    tag.setAttribute(i, attr[i]);
                }
                tag.innerHTML = html;
                return tag;
            }

            /**
             * 隐藏日历
             */
            function hideCalen() {
                toolClass(oCalenWrap, 'close');
                setTimeout(function () {
                    toolClass(oCalenWrap, 'active', 'remove');
                    toolClass(oCalenWrap, 'close', 'remove');
                }, 290)
            }

            /**
             * 日历的格式
             * @param  {[type]} str  [description]
             * @param  {[type]} fmat [description]
             * @return {[type]}      [description]
             */
            function format(str, fmat) {
                if (!str)return false;
                str = str.split('/');
                fmat = fmat || 'y/m/d';
                var n = fmat.charAt(0), count = 0;
                for (var i = 0; i < fmat.length; i++) {
                    if (n.charAt(count) != fmat.charAt(i)) {
                        n += fmat.charAt(i);
                        count++;
                    }
                }
                var data = {"y": str[0], "m": str[1], "d": str[2]}, symbol = '', result = '';
                if (/\//g.test(n)) {
                    symbol = '/';
                } else if (/\-/g.test(n)) {
                    symbol = '-';
                }
                n = n.split(symbol);
                for (var i = 0; i < n.length; i++) {
                    result += data[n[i]];
                    if (i < n.length - 1)result += symbol;
                }
                return result;
            }

            /**
             * / 字符串获取年月日
             * @param  {[type]} str [description]
             * @param  {[type]} one [description]
             */
            function getDate(str, one) {
                str = str.replace(/[\'\s]+/g, '');
                if (!str)return;
                str = str.match(/(\d+[\/\-]\d+[\/\-]\d+)/g);
                var data = [];
                for (var i = 0; i < str.length; i++) {
                    var arr = str[i].match(/\d+/g), result = {};
                    if (arr.length == 3) {
                        result["m"] = arr[1];
                        if (arr[0].length == 4) {
                            result["y"] = arr[0];
                            result["d"] = arr[2];
                        } else {
                            result["d"] = arr[0];
                            result["y"] = arr[2];
                        }
                    }
                    else if (arr.length == 2) {
                        if (arr[0].length == 4) {
                            result["y"] = arr[0];
                            result["m"] = arr[1];
                        }
                        else if (arr[0].length <= 2) {
                            result["m"] = arr[0];
                            result["d"] = arr[1];
                        }
                    }
                    data.push(result);
                }
                return data;
            }

            new Calendar();
        }
    };
})