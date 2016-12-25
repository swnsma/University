<?php

require_once '/home/swnsma/projects/tests/vendor/autoload.php';

class EditContact_Test extends \PHPUnit_Extensions_Selenium2TestCase
{
    protected function setUp()
    {
        $this->setBrowser("firefox");
        $this->setBrowserUrl("http://tests.local/index.php");
    }

    public function getContactTestData()
    {
        return array(
            'firstname' => 'firstname' . rand(1, 10000),
            'lastname' => 'lastname' . rand(1, 10000),
            'address' => 'address' . rand(1, 10000),
            'home' => '+38097' . rand(1000000, 9999999),
            'mobile' => '+38097' . rand(1000000, 9999999),
            'work' => '+38097' . rand(1000000, 9999999),
            'email' => 'email' . rand(100, 19000) . '@mail.com',
            'email2' => 'email' . rand(100, 19000) . '@mail.com',
            'bday' => rand(1, 31),
            'bmonth' => $this->getMonthData()[rand(0, 11)],
            'byear' => rand(1950, 2010),
            'address2' => 'address' . rand(1, 10000),
            'phone2' => '+38097' . rand(1000000, 9999999)
        );
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

    public function fillContactForm($data)
    {
        $element = $this->element($this->using('css selector')->value('input[name="firstname"]'));
        $element->clear();
        $element->value($data['firstname']);
        $element = $this->element($this->using('css selector')->value('input[name="lastname"]'));
        $element->clear();
        $element->value($data['lastname']);
        $element = $this->element($this->using('css selector')->value('textarea[name="address"]'));
        $element->clear();
        $element->value($data['address']);
        $element = $this->element($this->using('css selector')->value('input[name="home"]'));
        $element->clear();
        $element->value($data['home']);
        $element = $this->element($this->using('css selector')->value('input[name="mobile"]'));
        $element->clear();
        $element->value($data['mobile']);
        $element = $this->element($this->using('css selector')->value('input[name="work"]'));
        $element->clear();
        $element->value($data['work']);
        $element = $this->element($this->using('css selector')->value('input[name="email"]'));
        $element->clear();
        $element->value($data['email']);
        $element = $this->element($this->using('css selector')->value('input[name="email2"]'));
        $element->clear();
        $element->value($data['email2']);
        $this->select($this->element($this->using('css selector')->value('select[name="bday"]')))->selectOptionByValue($data['bday']);
        $this->select($this->element($this->using('css selector')->value('select[name="bmonth"]')))->selectOptionByValue($data['bmonth']);
        $element = $this->element($this->using('css selector')->value('input[name="byear"]'));
        $element->clear();
        $element->value($data['byear']);
        $element = $this->element($this->using('css selector')->value('textarea[name="address2"]'));
        $element->clear();
        $element->value($data['address2']);
        $element = $this->element($this->using('css selector')->value('input[name="phone2"]'));
        $element->clear();
        $element->value($data['phone2']);

    }

    public function submitUpdate()
    {
        $element = $this->element($this->using('css selector')->value('input[name="update"]'));
        $element->click();
    }

    public function openEditPage()
    {
        $this->byXPath('//*[@id="maintable"]/tbody/tr[2]/td[7]/a')->click();
    }

    public function testScenario()
    {
        $this->openAddressList();
        $this->openEditPage();
        $contactData = $this->getContactTestData();
        $this->fillContactForm($contactData);
        $this->submitUpdate();
        $this->openAddressList();
        $this->assertTrue($this->verify($contactData));

    }

    public function verify($criteria)
    {
        $elements = $this->elements($this->using('css selector')->value('#maintable td'));
        $checks = array(
            'firstname' => false,
            'lastname' => false,
            'home' => false
        );

        foreach($checks as $key => $check) {
            foreach($elements as $element) {
                if ($element->text() == $criteria[$key]) {
                    echo $element->text();
                    continue 2;
                }
            }
            return false;
        }
        $elements = $this->elements($this->using('css selector')->value('#maintable td a'));

        foreach($elements as $element) {
            if ($element->text() == $criteria['email']) {
                echo $element->text();
                return true;
            }
        }

        return false;
    }

    protected function openAddressList()
    {
        $this->url("http://tests.local/index.php");
    }
}
