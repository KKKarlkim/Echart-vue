<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId:null, //定时器标识
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候，主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    // 组件销毁时，需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: { 
    initChart(){
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'chalk')
      // 图标初始化
      const initOption = {
        title: {
          text: '丨 商家销售统计',
          textStyle: {
            fontSize:66
          },
          left: 20,
          top:20,
        },
        grid:{
          top:'15%',
          left:'3%',
          right:'6%',
          bottom: '3%',
          containLabel:true //距离包含坐标轴上的文字
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z:0,
            lineStyle: {
              width: 66,
              color:'#2D3443'
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: 66,
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color:'white'
            }
          },
          itemStyle: {
            barBorderRadius: [0, 33, 33, 0],
            // 指明渐变方向
            // 不同百分比之下颜色的值
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              // 百分之0状态之下的颜色值
                {
                  offset: 0,
                  color:'#5052EE'
                },
                // 百分之百状态之下的颜色值
                {
                  offset: 1,
                  color:'#AB6EE5'
                }
              ]
            )
          }
        }]
      }
      this.chartInstance.setOption(initOption)
      // 鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })

      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },

    async getData() {
      const {data: ret} = await this.$http.get('seller')
      this.allData = ret
      // 排序
      this.allData.sort((a,b) => {
        return a.value - b.value
      })

      // 每五个元素一页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1 
      this.updateChart()
      this.startInterval()
    },

    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)

      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [{
          data: sellerValues,
        }]
      }
      this.chartInstance.setOption(dataOption)
    },

    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage ++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000);
    },
    // 当浏览器大小发生变化的时候，重新渲染图片
    screenAdapter() {
      // 获取div宽度
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 配置和屏幕大小相关的配置
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            }
          }
        },
        series: [{
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
          }
        }]
      }
      this.chartInstance.setOption(adapterOption)
      // 只有手动调用resize，才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less">
  
</style>
