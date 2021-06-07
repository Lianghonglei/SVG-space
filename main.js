const space = {
    svg: document.getElementById('svg-wrap'),
    infoList: document.getElementsByClassName('infoList')[0],
    outline: document.getElementById('outline'),
    box: document.querySelector('#box'),
    leftDisplay: document.getElementsByClassName('left-display')[0],
    str: '',
    currentEle: null,
    init: function () {
        this.bindEvent()
        this.mouseWheelScale()
        this.drag(this.box)
    },
    bindEvent() {
        this.svg.addEventListener('click', (e) => {
            if (e.target === this.svg) {
                if (this.currentEle) {
                    this.clearBorder()
                    this.str = ''
                    this.infoList.innerHTML = this.str
                }
            } else if (e.target.tagName === "use") {
                this.currentEle = e.target
                this.str = ''
                this.drawBorder(e.target)
                this.getAttribute(e.target)
            }
        })
    },
    drawBorder: function (targetNode) {
        let size = targetNode.getBBox()
        this.addAttr(size)
    },
    addAttr: function (size) {
        this.outline.setAttribute('x', size.x - 1)
        this.outline.setAttribute('y', size.y - 1)
        this.outline.setAttribute('width', size.width + 2)
        this.outline.setAttribute('height', size.height + 2)
        this.outline.setAttribute('style', 'stroke-width:2;stroke:red;fill:transparent')
    },
    clearBorder: function () {
        this.outline.removeAttribute('x')
        this.outline.removeAttribute('y')
        this.outline.removeAttribute('width')
        this.outline.removeAttribute('height')
        this.outline.removeAttribute('style')
    },
    getAttribute: function (targetNode) {
        let spacecode = targetNode.attributes.spacecode.value
        const request = new XMLHttpRequest()
        request.open('GET', `http://192.168.31.90:8284/admin/station/queryStation/${spacecode}`)
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                const res = JSON.parse(request.response)
                if (res.code === 1001) {
                    this.displayAttribute(res.data)
                }else{
                    console.log('请求失败')
                }
            }
        }
        request.send()
    },
    displayAttribute: function (attrObj) {
        //展示座位信息
        let propObj = {
            id:'编号',
            spaceCode:'空间编号',
            stationNum:'工位编号',
            ip:'IP地址',
            personName:'员工名称',
            describes:'描述信息',
            userState:'状态',
        }
        for (let prop in attrObj) {
            if (attrObj.hasOwnProperty(prop)) {
                if(prop === 'userState'){
                    attrObj[prop] = '正常'
                }else if(prop === 'describes'){
                    attrObj[prop] = '智慧城市-软件事业部-软件研发室-员工'
                }
                this.str += `<li>
                <span class="name">${propObj[prop]}:</span>
                <span class="value">${attrObj[prop]}</span>
                </li>`
            }
        }
        this.infoList.innerHTML = this.str
    },
    mouseWheelScale() {//鼠标滚轮缩放
        const box = this.box
        this.leftDisplay.addEventListener('mousewheel', function (e) {
            let lastWidth = parseInt(box.style.width)
            let lastHeight = parseInt(box.style.height)
            if (e.deltaY > 0) {
                lastWidth = lastWidth + 10 > 260 ? 260 : lastWidth + 10
                lastHeight = lastHeight + 10 > 260 ? 260 : lastHeight + 10
                box.style.width = lastWidth + '%'
                box.style.height = lastHeight + '%'
            } else {
                lastWidth = lastWidth - 10 < 60 ? 60 : lastWidth - 10
                lastHeight = lastHeight - 10 < 60 ? 60 : lastHeight - 10
                box.style.width = lastWidth + '%'
                box.style.height = lastHeight + '%'
            }
        })
    },
    drag(elem) {
        var disX,
            disY;
        function addEvent(elem, type, fn) {
            if (elem.addEventListener) {
                elem.addEventListener(type, fn)
            } else {
                elem.attachEvent('on' + type, fn);
            }
        }
        function stopBubble(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
        function cancelHander(event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else if (event.returnValue) {
                event.returnValue = false;
            } else {
                return false;
            }
        }
        function getStyle(elem, prop) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(elem, null)[prop];
            } else {
                return elem.currentStyle[prop];
            }
        }
        function mouseMove(e) {
            var event = e || window.event;
            elem.style.left = event.pageX - disX + "px";
            elem.style.top = event.pageY - disY + "px";
        }
        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
        }
        addEvent(elem, 'mousedown', function mouseDown(e) {
            var e = e || window.event;
            disX = e.pageX - parseInt(getStyle(elem, 'left'));
            disY = e.pageY - parseInt(getStyle(elem, 'top'));
            addEvent(document, 'mousemove', mouseMove);
            addEvent(elem, 'mouseup', mouseUp);
            stopBubble(e);
            cancelHander(e);
        });
    },
}

space.init();
