import dayjs from 'dayjs';
import logger from 'pino';


const log = logger({
    prettifier:true,
    base:{
        pid: false
    },
    timestamp: ()=> `,"time":"${dayjs().format()}"`,

})
export default log;