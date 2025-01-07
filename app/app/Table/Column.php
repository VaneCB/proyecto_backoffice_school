<?php

namespace App\Table;

class Column
{
    public string $component = 'columns.column';

    public string $key;

    public string $label;

    public string $filterType = '';

    public bool $input = false;

    public function __construct($key, $label, $filterType = '', $input = false)
    {
        $this->key = $key;
        $this->label = $label;
        $this->filterType = $filterType;
        $this->input = $input;
    }

    public static function make($key, $label, $filterType = '', $input = false)
    {
        return new static($key, $label, $filterType, $input);
    }

    public function component($component)
    {
        $this->component = $component;

        return $this;
    }
}
