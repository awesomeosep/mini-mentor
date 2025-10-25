'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createClient } from '@/lib/supabase/client';

interface Skill {
  skill_id: string;
  name: string;
}

export function SkillSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange: (skillId: string) => void;
}) {
  const supabase = createClient();
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  function handleClose(newOpen: boolean) {
    if (!newOpen) {
      onChange(searchValue);
    }
    return setOpen(newOpen);
  }

  React.useEffect(() => {
    fetchSkills();
  }, []);

  async function createSkill(skillName: string) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({ name: skillName })
        .select('*')
        .single();
      if (data) {
        const tempSkills = skills;
        tempSkills.push({ skill_id: data.skill_id, name: skillName });
        alert('Skill created!');
      } else {
        console.error('Error creating skill:', error);
        alert('Error creating skill.');
      }
    } catch (error) {
      console.error('Error creating skill:', error);
      alert('Error creating skill.');
    }
  }

  const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*').order('name');
    if (error) console.error(error);
    else setSkills(data ?? []);
  };

  const handleSelect = async (selectedName: string) => {
    let skill = skills.find((s) => s.name.toLowerCase() === selectedName.toLowerCase());

    if (!skill) {
      const { data, error } = await supabase
        .from('skills')
        .insert({ name: selectedName })
        .select()
        .single();
      if (error) {
        console.error(error);
        return;
      }
      skill = data;
      if (skill) {
        setSkills((prev) => [...prev, skill].filter((s) => s != undefined) as Skill[]);
      }
    }
    if (skill) {
      onChange(skill.skill_id);
      setSearchValue(skill.name);
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleClose}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[250px] justify-between"
        >
          {searchValue ||
            (value ? skills.find((s) => s.skill_id === value)?.name : '') ||
            'Select a skill...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search new skill..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              <div className="align-center flex flex-row items-center justify-center gap-2">
                <p>No skill found.</p>
                <Button variant="outline" onClick={() => createSkill(searchValue)}>
                  Create skill
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {skills
                .filter((s) => s.name.toLowerCase().includes(searchValue.toLowerCase()))
                .map((skill) => (
                  <CommandItem
                    key={skill.skill_id}
                    value={skill.name}
                    onSelect={() => handleSelect(skill.name)}
                  >
                    {skill.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === skill.skill_id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
