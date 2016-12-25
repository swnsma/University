<?php

abstract class Entity
{
    /** @var  PHPUnit_Extensions_Selenium2TestCase */
    protected $subject;

    /** @var  array */
    protected $data;

    public function __construct($subject = null, $data = null)
    {
        $this->subject = $subject;
        $this->data = $data;
    }

    public function setSubject($subject)
    {
        $this->subject = $subject;
    }

    public function setData($data)
    {
        $this->data = $data;
    }

    public function __get($name)
    {
        if (isset($this->data[$name])) {
            return $this->data[$name];
        } else {
            return null;
        }
    }
}