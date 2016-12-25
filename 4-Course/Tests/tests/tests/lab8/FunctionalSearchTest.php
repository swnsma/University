<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';
require_once'Framework/Record.php';


class FunctionalSearchTest extends PHPUnit_Extensions_Selenium2TestCase
{
    protected $_list = array();

    protected function setUp()
    {
        $this->setBrowser('firefox');
        $this->setBrowserUrl('http://tests.local/index.php');
    }


    protected function tearDown()
    {
        /** @var Record $item */
        foreach($this->_list as $item) {
            $item->deleteRecordScenario();
        }
    }

    public function getMonthData()
    {
        return array(
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        );
    }

    /**
     * @dataProvider data
     *
     * @param $searchStrings
     * @param $records
     */
    public function testScenario($records, $searchStrings = array())
    {
        foreach($records as $record) {
            $item = new Record($this, $record);
            $item->createRecordScenario();
            $this->_list[] = $item;
        }

        $this->openAddressList();
        if ($searchStrings) {
            $fields = $searchStrings;
        } else {
            $fields = $this->getAllField();
        }
        foreach($fields as $text){
            $element = $this->element($this->using('css selector')->value('#search-az > form:nth-child(1) > input:nth-child(1)'));
            $element->clear();
            $element->value($text);
            $newFields = $this->getAllField();
            $this->screenshotInFolder();
            echo $text  . PHP_EOL;
            foreach($newFields as $newText){
                echo $newText . PHP_EOL;
                if(strpos($newText, $text) !== false){
                    $this->assertTrue(true);
                    continue 2;
                }
            }
            $this->assertTrue(false);
        }


    }


    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
        $this->screenshotInFolder();
    }


    protected function getAllField(){
        $items = $this->elements($this->using('css selector')->value('#maintable td:not(.center)'));

        $texts = [];
        foreach($items as $item){
            $text = $item->text();
            if($text) {
                $texts[] = $text;
            }
        }
        return $texts;
    }

    public function screenshotInFolder()
    {
        $file = __DIR__ . '/' . __CLASS__ .'/' . $this->getName() . '-' . time() . rand(0, 100) . '.png';
        $this->screenshot($file);
    }


    public function screenshot($file)
    {
        $filedata = $this->currentScreenshot();
        file_put_contents($file, $filedata);
    }

    public function data()
    {
        return array(
            0 => array(
                array(
                    array(
                        'firstname' => 'FirstName',
                        'lastname' => 'SecondName',
                        'address' => 'Address value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324',
                        'work' => '+38097',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 11,
                        'bmonth' => $this->getMonthData()[2],
                        'byear' => 1995,
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'sadfasdfasd',
                        'lastname' => 'SecondName',
                        'address' => 'Address value',
                        'home' => '0974242432',
                        'mobile' => '32143124',
                        'work' => '380974324324',
                        'email' => 'email@gmail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 11,
                        'bmonth' => $this->getMonthData()[5],
                        'byear' => 1999,
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'FirsssadfstName',
                        'lastname' => 'SecondNsdfasdfame',
                        'address' => 'Addresfasdfass value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324',
                        'work' => '+380974324324',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 11,
                        'bmonth' => $this->getMonthData()[10],
                        'byear' => 1995,
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    )
                ),
            ),
            1=> array(
                array(
                    array(
                        'firstname' => 'FirstName',
                        'lastname' => 'SecondName',
                        'address' => 'Address value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324fds',
                        'work' => '+38097',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 11,
                        'bmonth' => $this->getMonthData()[2],
                        'byear' => 1995,
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'Naame',
                        'lastname' => '',
                        'address' => 'Address value',
                        'home' => '0974242432',
                        'mobile' => '324324fds',
                        'work' => '',
                        'email' => 'email.com',
                        'email2' => 'email@mail.com',
                        'bday' => 12,
                        'bmonth' => $this->getMonthData()[5],
                        'byear' => 'string',
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    ),
                    array(
                        'firstname' => 'FirsssadfstName',
                        'lastname' => 'SecondNsdfasdfame',
                        'address' => 'Addresfasdfass value',
                        'home' => '+380974242432',
                        'mobile' => '+380974324324fds',
                        'work' => '+38097',
                        'email' => 'email@mail.com',
                        'email2' => 'email@mail.com',
                        'bday' => 12,
                        'bmonth' => $this->getMonthData()[10],
                        'byear' => 2018,
                        'address2' => 'addresssdasd',
                        'phone2' => '+380974232'
                    )
                ),
                array(
                    'email',
                    '4242',
                    'Naame',
                    'SecondName'
                )
            )
        );
    }

}