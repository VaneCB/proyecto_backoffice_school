<?php

namespace App\Table;

class RowAction
{
    public string $title;
    public string $icon;
    public string $routeName;

    /**
     * @param string|null $icon
     * @param string|null $routeName
     */
    public function __construct(string $title, string $icon = null, string $routeName = null)
    {
        $this->title = $title;
        $this->icon = $icon;
        $this->routeName = $routeName;
    }


}
