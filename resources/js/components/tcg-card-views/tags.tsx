export default function Tags({tags}) {
    if(!tags){
        return;
    }

    return (
        <div className="flex flex-wrap gap-2 w-auto">
            {Object.entries(tags).map(([label, value]) => (
                <div key={'tag-' + label + '-' + value} className="tcg-card-display-tag text-sm">
                    <div className="text-xs opacity-50">{label}</div>
                    <div>{value}</div>
                </div>
            ))}
        </div>
    );
}