<!DOCTYPE html>
<html lang="en" >
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title >UCG Deckbuilder</title>
        @vite(['resources/css/app.css', 'resources/js/app.ts'])
        @inertiaHead
    </head>
    <body class="bg-white text-black dark:bg-black dark:text-white">
        <div class="p-6">
            <div id="header" class="flex w-full justify-between mb-4">
                <h1>UCG Deckbuilder</h1>
                <div>
                    <input type="button" id="toggle-dark" value="Enable Dark Mode"/>
                    <input type="button" class="hidden" id="toggle-light" value="Enable Light Mode"/>
                </div>
            </div>
            <div class=" bg-orange-300 h-full min-h-[90vh]">
                @inertia
            </div>
        </div>
    </body>
</html>