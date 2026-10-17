import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    parseInterpolation: 'mf2';
    interpolationFormatTypeMap: { uppercase: string };
    resources: {
      custom: {
        greeting: 'Hello {$name}!';
        count: 'You have {$count :number} items';
        plural: '.input {$count :number}\n.match $count\none {{You have {$count} item}}\n* {{You have {$count} items}}';
        local: '.local $c = {$count :integer}\n.match $c\none {{One file}}\n* {{{$c} files in {$folder}}}';
        date: 'Updated {$when :datetime dateStyle=short}';
        options: '{$amount :number minimumFractionDigits=$digits}';
        markup: 'Read {#link href=$url}the terms{/link}';
        literal: '{|{$notAnArgument}| :string} for {$name}';
        escaped: 'Use \\{$notAnArgument\\} for {$name}';
        quoted: '{{Hello {$name}}}';
        text: '{$value :string}';
        custom: '{$value :uppercase}';
        dotted: 'Hi {$user.name}';
        plain: 'Just a plain string';
      };
    };
  }
}
