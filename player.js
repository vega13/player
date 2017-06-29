var log = console.log.bind(console)

var e = function(sel) {
    return document.querySelector(sel)
}

var es = function(sel) {
    return document.querySelectorAll(sel)
}

var bindAll = function(elements, eventName, callback) {
    for (var i = 0; i < elements.length; i++) {
        var tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

var toggle = function(control=true) {
    var audioPlay = e('.gua-audio-play')
    var audioStop = e('.gua-audio-stop')
    if(control == true) {
        audioPlay.style.display = 'none'
        audioStop.style.display = 'inline-block'
    } else {
        audioPlay.style.display = 'inline-block'
        audioStop.style.display = 'none'
    }
}

var setTime = function(second) {
    var time = ''
    var minute = Math.floor(second / 60)
    second = second % 60
    time = minute + ':'+ second
    return time
}

var show_time = function() {
    var name = a.src
    // var now = e('.gua-audio-now')
    var new_time = e('.gua-audio-newTime')
    var all_time = e('.gua-audio-allTime')
    // log('new_time & all_time', new_time, all_time)
    name = name.split('/')
    name = name[name.length - 1]
    // now.innerHTML = name.split('.mp3')[0]
    new_time.innerHTML = setTime(Math.round(a.currentTime))
    all_time.innerHTML = '/' + setTime(Math.round(a.duration))
}

var auto_time = function() {
    var interval = 1000
    setInterval(function(){
        // 每 1s 都会调用这个函数
        show_time()
    }, interval)
}

var shiftSong = function(number) {
    var paths = []
    for (var i = 0; i < songs.length; i++) {
        paths.push(songs[i].dataset.path)
    }
    var src = a.dataset.src
    var index = -1
    // log('paths & src & index', paths, src, index)
    for (var i = 0; i < paths.length; i++) {
        if (src == paths[i]) {
            index = i
            // log('paths[i] & src & paths[i] == src & index', paths[i], src, paths[i] == src, index)
            break;
        }
    }
    if (index != -1) {
        index = (paths.length + index + number) % paths.length
        // log('index', index)
        a.src = paths[index]
        a.dataset.src = paths[index]
    }
}

var leftSong = function() {
    shiftSong(-1)
}

var rightSong = function() {
    shiftSong(1)
}

var bindClickLeft = function() {
    var left = e('.gua-audio-left')
    left.addEventListener('click', function(event){
        leftSong()
    })
}

var bindClickRight = function() {
    var right = e('.gua-audio-right')
    right.addEventListener('click', function(event){
        rightSong()
    })
}

var bindSongCycle = function() {
    var one_loop = e('.gua-audio-oneLoop')
    var all_loop = e('.gua-audio-allLoop')

    // 单曲循环
    one_loop.addEventListener('click', function(event){
        a.addEventListener('ended', function(event){
            event.target.play()
        })
    })
    // 列表循环
    all_loop.addEventListener('click', function(event){
        a.addEventListener('ended', function(event){
            rightSong()
        })
    })
    // 随机循环
    var chaos_loop = e('.gua-audio-chaosLoop')
    chaos_loop.addEventListener('click', function(event){
        a.addEventListener('ended', function(event){
            var index = Math.random() * songs.length
            index = Math.round(index)
            shiftSong(index)
        })
    })

    // 默认单曲循环
    a.addEventListener('ended', function(event){
        event.target.play()
    })
}

var bindClickSongList = function() {
    var songs = es('.gua-songList')
    bindAll(songs, 'click', function(event) {
        // log('event.target', event.target)
        var target = event.target
        var path = target.dataset.path
        // log('path', path)
        a.src = path
        a.dataset.src = path
        var found = e('.gua-song-found')
        found.classList.remove('gua-song-found')
        target.classList.add('gua-song-found')
        toggle()
    })
}

var bindClickPlay = function() {
    var play = e('.gua-audio-play')
    play.addEventListener('click', function(event){
        var self = event.target
        toggle()
        a.play()

    })
}

var bindClickStop = function() {
    var stop = e('.gua-audio-stop')
    stop.addEventListener('click', function(event){
        var self = event.target
        log('click stop', self)
        toggle(false)
        a.pause()
    })
}

var bindAudioCanplay = function() {
    a.addEventListener('canplay', function(event){
        event.target.play()
    })
}

var autoProgressBarBlue = function() {
    var interval = 1000
    setInterval(function(){
        // 每 1s 都会调用这个函数
        updateBlue()
    }, interval)
}

var updateBlue = function() {
    var currentTime = Math.round(a.currentTime)
    var duration = Math.round(a.duration)
    var n = currentTime / duration
    n = Math.round(n * 100)
    var width = n * 3.6
    var blue = e('.progress-bar-blue')
    blue.style.width = `${width}px`
}

var __main = function() {
    auto_time()
    bindClickLeft()
    bindClickRight()
    bindSongCycle()
    bindClickSongList()
    bindClickPlay()
    bindClickStop()
    bindAudioCanplay()
    autoProgressBarBlue()
}

var a = e('#id-audio-player')

__main()
