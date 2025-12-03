export default function DetailTags({details}) {
    return (
        <div className="flex flex-wrap gap-2 w-auto">
            {Object.entries(details).map(([label, value]) => (
                <div className="tcg-card-display-tag text-sm">
                <div className="text-xs opacity-50">{label}</div>
                <div>{value}</div>
                </div>
            ))}
        </div>
    );
}