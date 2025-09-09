<div class="h-64 max-h-64 overflow-scroll">
    <ul>
        @foreach($standardVariants as $standardVariant)
            <li>{{ $standardVariant->name }} ({{$standardVariant->serial}})</li>    
        @endforeach
    </ul>
</div>