import { MONTHS } from '@/app/constants';
import { KeyValueProp } from '@/app/types';
import { Select, SelectItem } from '@nextui-org/react';

export default function DateSelection({
    years,
    month,
    setMonth,
    year,
    setYear,
    emptyMonth = false
}: {
    years?: KeyValueProp<string, string>[];
    month: number;
    setMonth: React.Dispatch<React.SetStateAction<number>>;
    year: string;
    setYear: React.Dispatch<React.SetStateAction<string>>;
    emptyMonth?: boolean;
}) {
    return (
        <>
            <Select
                selectedKeys={[String(month)]}
                placeholder="Select a month"
                className="w-3/5"
                variant="faded"
                onChange={(e) => setMonth(Number(e.target.value))}
                disallowEmptySelection={emptyMonth}
                style={{
                    backgroundColor: "white"
                }}
            >
                {MONTHS.map((month, index) => (
                    <SelectItem key={index + 1} value={month}>
                        {month}
                    </SelectItem>
                ))}
            </Select>
            <Select
                items={years}
                selectedKeys={[year]}
                placeholder="Select a year"
                className="w-2/5"
                variant="faded"
                onChange={(e) => setYear(e.target.value.toString())}
                disallowEmptySelection
                style={{
                    backgroundColor: "white"
                }}
            >
                {(year: KeyValueProp<string, string>) => (
                    <SelectItem key={year.value} value={year.value}>
                        {year.label}
                    </SelectItem>
                )}
            </Select>
        </>
    );
}
