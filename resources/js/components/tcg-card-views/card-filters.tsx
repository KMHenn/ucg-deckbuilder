import { useState, useEffect } from 'react';
import { MultiSelect, TextInput, ActionIcon} from '@mantine/core';
import {IconAdjustmentsAlt } from '@tabler/icons-react';

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
                {Object.entries(selectedFilters).map(([key, values]) =>
                <span key={`${key}-active-filters`}
                    className="w-fit bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">{filters[key].label}: {values.join(', ')}</span>
                )}
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
                        <div className="w-max h-max m-auto bg-gray-400 p-5 rounded-lg">
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