import { useState, useEffect } from 'react';
import { MultiSelect, TextInput, ActionIcon} from '@mantine/core';
import {IconAdjustmentsAlt } from '@tabler/icons-react';

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
        <div className="flex justify-between gap-2 mb-4">
            {/* <div>
                <TextInput
                    placeholder="Search by name"
                />
            </div> */}

            {Object.keys(selectedFilters).length > 0 ?
            <div className="flex flex-wrap gap-2 mb-2">
                {/* @TODO not using pretty names for options, pill persists when empty */}
                {Object.entries(selectedFilters).map(([key, values]) => {
                    let pills = values.map((value) => {
                        const colorClass = PILL_COLORS[key] || "bg-gray-300 text-gray-800";

                        return (<div className={`w-fit px-3 py-1 rounded-full text-sm flex items-center gap-1 ${colorClass}`}>
                            <span key={`${key}-active-filters-${value}`} >{value}</span>
                            <button
                                onClick={() => {
                                    // Remove this value from the selectedFilters
                                    onChange((prev) => ({
                                    ...prev,
                                    [key]: prev[key].filter((v) => v !== value),
                                    }));
                                }}
                                className={`font-bold ml-1 ${colorClass}`}
                                >
                                x
                                </button>
                        </div>);
                    })

                    return (
                        <div>
                            <span>{filters[key].label}</span>
                            <div className="flex flex-wrap w-fit gap-2">
                            {pills}
                            </div>
                        </div>);
                })}
            </div> : ''}
            
            <div className="flex ml-auto">
                <ActionIcon
                className="my-auto"
                onClick={() => setModal(true)}>
                    <IconAdjustmentsAlt />
                </ActionIcon>
                
            </div>

            {modal && 
                <>
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-10"  
                        onClick={() => setModal(false)}>
                    </div>
                    <div className="absolute left-0 right-0 w-max h-max  m-auto z-20">
                        <div className="w-[80vw] h-max m-auto bg-gray-400 p-5 grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.entries(filters).map(([key, config]) => (
                                <div key={key + `-filter`}>
                                    <MultiSelect
                                        label={config.label}
                                        placeholder={"Select " + config.label}
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