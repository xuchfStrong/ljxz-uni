const global = {}
global.wdszVersion = 123
global.wdszSaleChannel = 0 // 0:测试， 1:悟空，2:玉清，3:淘宝, 4:剑意， 5:键来，7:渠道7
global.wdszVersionName = global.wdszVersion.toString().split('').join('.')
export default global
