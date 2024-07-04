import { ref, onMounted } from 'vue';
export function useMouse () {
    // 当鼠标移动的时候获取鼠标的位置
    let x = ref(0);
    let y = ref(0);

    // document.onmousemove = function(e) {
    //     e = e ? e: window.event;
    //     // document.writeln("X:" + e.screenX + "Y:" + e.screenY);
    //     x = e.screenX;
    //     y = e.screenY;
    // }
    onMounted(() => window.addEventListener('mousemove', (event) => {
        x.value = event.pageX
        y.value = event.pageY
    }))
    return {x,y};
};