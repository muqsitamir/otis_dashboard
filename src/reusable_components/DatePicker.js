import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function DatePicker(props) {

    return (
      <div className="center tc pv3 ph2">
        <DateRange
        ranges={[props.ranges]}
        onChange={props.onChange}
        />
        </div>
    );
}
