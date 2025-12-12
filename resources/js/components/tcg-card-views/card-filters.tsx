import { useState, useEffect } from 'react';
import { MultiSelect, TextInput, ActionIcon, Button} from '@mantine/core';
import {IconAdjustmentsAlt, IconX } from '@tabler/icons-react';

const PILL_COLORS = {
  rarity:   "bg-purple-200 text-purple-800",
  feature:  "bg-green-200 text-green-800",
  level:    "bg-blue-200 text-blue-800",
  round:    "bg-yellow-200 text-yellow-900",
  type:     "bg-red-200 text-red-800",
  character_name: "bg-pink-200 text-pink-800",
  participating_works: "bg-teal-200 text-teal-800",
  section_bundle: "bg-gray-200 text-gray-800"
};

export default function CardFilters({filters, selectedFilters = {}, onChange}) {
    const [modal, setModal] = useState(false);

    if(!filters){
      return null;
    }

    return (
        <div className="flex flex-col w-full mb-2">
            <div className="flex items-center justify-end">
                <Button rightSection={<IconAdjustmentsAlt />} onClick={() => setModal(true)}>
                    Filters
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 w-full">
                {Object.entries(selectedFilters).map(([filterKey, values]) => {
                    if(!values || values.length === 0){
                        return null;
                    }

                    const colorClass = PILL_COLORS[filterKey] || "bg-gray-300 text-gray-800";
                    const labelText = values.map((val) => filters[filterKey]?.options?.find((o) => o.value === val)?.label || val).join(", ");

                    {/* @TODO Participating Works looks stupid with how long some titles are */}
                    return (
                        <div key={filterKey}
                            className={`px-3 py-1 rounded-full text-sm flex flex-wrap h-fit items-center gap-2 ${colorClass}`}>
                            <div><span className="font-bold">{filters[filterKey].label}</span>: {labelText}</div>
                        </div>
                        );
                    }
                )}
            </div>

            {modal && 
                <>
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-10"  
                        onClick={() => setModal(false)}>
                    </div>
                    <div className="absolute left-0 right-0 w-max h-max  m-auto z-20">
                        <div className="w-[80vw] md:w-[50vw] h-max m-auto bg-white p-5 grid gap-x-4 gap-y-2 rounded-md">
                            <div className="flex justify-between">
                                <h1 className="text-lg font-bold">Filters</h1>
                                <ActionIcon className="ml-auto" onClick={() => setModal(false)}>
                                    <IconX />
                                </ActionIcon>
                            </div>
                            {Object.entries(filters).map(([key, config]) => (
                                <div key={key + `-filter`}>
                                    <MultiSelect
                                        className="max-w-[75vw] md:max-w-[45vw]"
                                        label={config.label}
                                        placeholder={"Select a " + config.label}
                                        data={config.options}
                                        value={selectedFilters[key] || []}
                                        onChange={(values) => onChange?.((prev) => ({
                                            ...prev,
                                            [key]: values
                                        }))}
                                        searchable
                                        clearable/>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
        </div>
    );
}