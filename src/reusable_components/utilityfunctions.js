
export function convert_to_request_parameters(range, startTime, endTime){
    let start_date = range.startDate ? range.startDate.getFullYear() + '-' + (range.startDate.getMonth() + 1) + '-' + range.startDate.getDate() : '';
    let start_ts = start_date === "" ? "" : "T" + startTime.getHours() + "%3A" + startTime.getMinutes() + "%3A" + startTime.getSeconds() ;
    let end_date = range.endDate.getFullYear() + '-' + (range.endDate.getMonth() + 1) + '-' + range.endDate.getDate();
    let end_ts =  "T" + endTime.getHours() + "%3A" + endTime.getMinutes() + "%3A" + endTime.getSeconds() ;
    let result = {
        start: start_date + start_ts,
        end: end_date + end_ts
    }
    return result;
}